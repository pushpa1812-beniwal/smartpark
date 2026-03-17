import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ParkingSlot {
    id: string;
    floor: bigint;
    status: SlotStatus;
    zone: string;
    pricePerHour: number;
    slotNumber: string;
}
export interface Analytics {
    totalBookings: bigint;
    occupiedSlots: bigint;
    availableSlots: bigint;
}
export interface Booking {
    id: string;
    startTime: bigint;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    endTime: bigint;
    userId: Principal;
    vehicleNumber: string;
    durationHours: bigint;
    slotId: string;
    qrCode: string;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    active = "active",
    cancelled = "cancelled",
    completed = "completed"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid"
}
export enum SlotStatus {
    occupied = "occupied",
    booked = "booked",
    available = "available"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSlot(zone: string, slotNumber: string, floor: bigint, pricePerHour: number): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookSlot(slotId: string, vehicleNumber: string, startTime: bigint, durationHours: bigint): Promise<Booking>;
    cancelBooking(bookingId: string): Promise<void>;
    confirmPayment(bookingId: string): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAnalytics(): Promise<Analytics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getParkingSlots(): Promise<Array<ParkingSlot>>;
    getUserBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeSlot(slotId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSlotStatus(slotId: string, status: SlotStatus): Promise<void>;
}
