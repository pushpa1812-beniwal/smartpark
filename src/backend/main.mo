import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type SlotStatus = { #available; #booked; #occupied };

  type BookingStatus = { #active; #completed; #cancelled };

  type PaymentStatus = { #pending; #paid };

  type ParkingSlot = {
    id : Text;
    zone : Text;
    slotNumber : Text;
    floor : Nat;
    status : SlotStatus;
    pricePerHour : Float;
  };

  module ParkingSlot {
    public func compareByZone(slot1 : ParkingSlot, slot2 : ParkingSlot) : Order.Order {
      Text.compare(slot1.zone, slot2.zone);
    };
  };

  type Booking = {
    id : Text;
    userId : Principal;
    slotId : Text;
    vehicleNumber : Text;
    startTime : Int;
    endTime : Int;
    durationHours : Nat;
    status : BookingStatus;
    qrCode : Text;
    paymentStatus : PaymentStatus;
  };

  public type UserProfile = {
    name : Text;
  };

  type Analytics = {
    totalBookings : Nat;
    availableSlots : Nat;
    occupiedSlots : Nat;
  };

  let slotStatusText = Map.fromIter<Text, SlotStatus>([
    ("available", #available),
    ("booked", #booked),
    ("occupied", #occupied),
  ].values());

  let bookingStatusText = Map.fromIter<Text, BookingStatus>([
    ("active", #active),
    ("completed", #completed),
    ("cancelled", #cancelled),
  ].values());

  let paymentStatusText = Map.fromIter<Text, PaymentStatus>([
    ("pending", #pending),
    ("paid", #paid),
  ].values());

  // Internal state
  let slots = Map.empty<Text, ParkingSlot>();
  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper functions
  func generateId(prefix : Text) : Text {
    prefix # "_" # Time.now().toText();
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Parking Slot Functions
  public query ({ caller }) func getParkingSlots() : async [ParkingSlot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view parking slots");
    };
    slots.values().toArray().sort(ParkingSlot.compareByZone);
  };

  public shared ({ caller }) func bookSlot(slotId : Text, vehicleNumber : Text, startTime : Int, durationHours : Nat) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book slots");
    };

    let slot = switch (slots.get(slotId)) {
      case (null) { Runtime.trap("Slot not found") };
      case (?s) { s };
    };

    if (slot.status != #available) {
      Runtime.trap("Slot is not available");
    };

    let bookingId = generateId("booking");
    let endTime = startTime + durationHours * 3600 * 1000000000;

    let booking : Booking = {
      id = bookingId;
      userId = caller;
      slotId;
      vehicleNumber;
      startTime;
      endTime;
      durationHours;
      status = #active;
      qrCode = bookingId;
      paymentStatus = #pending;
    };

    let updatedSlot : ParkingSlot = {
      id = slot.id;
      zone = slot.zone;
      slotNumber = slot.slotNumber;
      floor = slot.floor;
      status = #booked;
      pricePerHour = slot.pricePerHour;
    };

    bookings.add(bookingId, booking);
    slots.add(slotId, updatedSlot);

    booking;
  };

  public shared ({ caller }) func cancelBooking(bookingId : Text) : async () {
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    if (booking.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized to cancel booking");
    };

    let slot = switch (slots.get(booking.slotId)) {
      case (null) { Runtime.trap("Slot not found") };
      case (?s) { s };
    };

    let updatedSlot : ParkingSlot = {
      id = slot.id;
      zone = slot.zone;
      slotNumber = slot.slotNumber;
      floor = slot.floor;
      status = #available;
      pricePerHour = slot.pricePerHour;
    };

    let updatedBooking : Booking = {
      id = booking.id;
      userId = booking.userId;
      slotId = booking.slotId;
      vehicleNumber = booking.vehicleNumber;
      startTime = booking.startTime;
      endTime = booking.endTime;
      durationHours = booking.durationHours;
      status = #cancelled;
      qrCode = booking.qrCode;
      paymentStatus = booking.paymentStatus;
    };

    slots.add(booking.slotId, updatedSlot);
    bookings.add(bookingId, updatedBooking);
  };

  public query ({ caller }) func getUserBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    let userBookings = List.empty<Booking>();

    for (booking in bookings.values()) {
      if (booking.userId == caller) {
        userBookings.add(booking);
      };
    };

    userBookings.toArray();
  };

  public shared ({ caller }) func confirmPayment(bookingId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can confirm payment");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    if (booking.userId != caller) {
      Runtime.trap("Unauthorized to confirm payment for this booking");
    };

    let updatedBooking : Booking = {
      id = booking.id;
      userId = booking.userId;
      slotId = booking.slotId;
      vehicleNumber = booking.vehicleNumber;
      startTime = booking.startTime;
      endTime = booking.endTime;
      durationHours = booking.durationHours;
      status = booking.status;
      qrCode = booking.qrCode;
      paymentStatus = #paid;
    };

    bookings.add(bookingId, updatedBooking);
  };

  // Admin Functions
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public shared ({ caller }) func updateSlotStatus(slotId : Text, status : SlotStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update slot status");
    };

    let slot = switch (slots.get(slotId)) {
      case (null) { Runtime.trap("Slot not found") };
      case (?s) { s };
    };

    let updatedSlot : ParkingSlot = {
      id = slot.id;
      zone = slot.zone;
      slotNumber = slot.slotNumber;
      floor = slot.floor;
      status = status;
      pricePerHour = slot.pricePerHour;
    };

    slots.add(slotId, updatedSlot);
  };

  public shared ({ caller }) func addSlot(zone : Text, slotNumber : Text, floor : Nat, pricePerHour : Float) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add slots");
    };

    let slotId = generateId("slot");
    let slot : ParkingSlot = {
      id = slotId;
      zone;
      slotNumber;
      floor;
      status = #available;
      pricePerHour;
    };

    slots.add(slotId, slot);
    slotId;
  };

  public shared ({ caller }) func removeSlot(slotId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove slots");
    };

    switch (slots.get(slotId)) {
      case (null) { Runtime.trap("Slot not found") };
      case (_) {};
    };
    slots.remove(slotId);
  };

  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    var totalBookings : Nat = 0;
    var availableSlots : Nat = 0;
    var occupiedSlots : Nat = 0;

    for (booking in bookings.values()) {
      totalBookings += 1;
    };

    for (slot in slots.values()) {
      switch (slot.status) {
        case (#available) { availableSlots += 1 };
        case (#occupied) { occupiedSlots += 1 };
        case (#booked) {};
      };
    };

    {
      totalBookings = totalBookings;
      availableSlots = availableSlots;
      occupiedSlots = occupiedSlots;
    };
  };
};
