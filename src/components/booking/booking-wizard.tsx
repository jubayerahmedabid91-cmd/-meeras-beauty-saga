"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, CheckCircle, Loader2, ArrowLeft, ArrowRight, Sparkles, PackageSearch, Star, Shield, Tag } from "lucide-react";
import { cn, formatMoney } from "@/lib/utils";
import { useCurrency } from "@/components/currency-provider";

type ServiceOption = {
  id: string;
  slug: string;
  name: string;
  durationMin: number;
  priceCents: number;
  categoryName: string;
};

type PackageOption = {
  id: string;
  slug: string;
  name: string;
  durationMin: number;
  priceCents: number;
};

type StaffOption = { id: string; name: string; jobTitle: string };

type SlotInfo = { time: string; taken: number; remaining: number; available: boolean };
type Availability = { date: string; capacity: number; slots: SlotInfo[] };

const STEPS = ["Service", "Date & Time", "Details", "Confirm"] as const;

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

export function BookingWizard({
  services,
  packages,
  staff,
  preselectedService,
  preselectedPackage,
}: {
  services: ServiceOption[];
  packages: PackageOption[];
  staff: StaffOption[];
  preselectedService?: string;
  preselectedPackage?: string;
}) {
  const router = useRouter();
  const currency = useCurrency();
  const money = (cents: number) => formatMoney(cents, currency);
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<"service" | "package">(
    preselectedPackage ? "package" : "service",
  );
  const [selectedService, setSelectedService] = useState<string>(preselectedService ?? "");
  const [selectedPackage, setSelectedPackage] = useState<string>(preselectedPackage ?? "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Slot availability follows the number of active specialists: one booking
  // per specialist per time slot.
  useEffect(() => {
    if (!date) {
      // Clearing the derived availability when the date is cleared is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailability(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/bookings/availability?date=${date}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Availability | null) => {
        if (!cancelled) setAvailability(data);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const slotInfo = useMemo(() => {
    const map = new Map<string, SlotInfo>();
    availability?.slots.forEach((s) => map.set(s.time, s));
    return map;
  }, [availability]);

  const selectedItem = useMemo(() => {
    if (kind === "service") {
      const s = services.find((x) => x.slug === selectedService);
      return s ? { name: s.name, durationMin: s.durationMin, priceCents: s.priceCents } : null;
    }
    const p = packages.find((x) => x.slug === selectedPackage);
    return p ? { name: p.name, durationMin: p.durationMin, priceCents: p.priceCents } : null;
  }, [kind, selectedService, selectedPackage, services, packages]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().slice(0, 10);
  }, []);

  // A different service or package changes the price, so the discount is cleared.
  useEffect(() => {
    // A new service/package invalidates the previously validated coupon.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCouponDiscount(0);
    setCouponMessage("");
  }, [kind, selectedService, selectedPackage]);

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (kind === "service" && !selectedService) newErrors.service = "Please select a service";
      if (kind === "package" && !selectedPackage) newErrors.package = "Please select a package";
    }
    if (step === 1) {
      if (!date) newErrors.date = "Please select a date";
      if (!time) newErrors.time = "Please select a time";
    }
    if (step === 2) {
      if (!form.name.trim()) newErrors.name = "Full name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function canContinue() {
    if (step === 0) return kind === "service" ? Boolean(selectedService) : Boolean(selectedPackage);
    if (step === 1) return Boolean(date && time);
    if (step === 2) return Boolean(form.name && form.email && form.phone);
    return true;
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        kind,
        serviceSlug: kind === "service" ? selectedService : null,
        packageSlug: kind === "package" ? selectedPackage : null,
        date,
        time,
        staffId: staffId || null,
        couponCode: couponDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
        customer: form,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not create your booking.");
        setSubmitting(false);
        return;
      }
      setConfirmed(json.bookingNumber);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponChecking(true);
    setCouponMessage("");
    try {
      const res = await fetch(
        `/api/coupons/validate?code=${encodeURIComponent(couponCode.trim())}&subtotalCents=${selectedItem?.priceCents ?? 0}`,
      );
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setCouponDiscount(data.discountCents);
        setCouponMessage(`Code ${data.code} applied — you save ${money(data.discountCents)}.`);
      } else {
        setCouponDiscount(0);
        setCouponMessage(data.reason ?? "That code is not valid.");
      }
    } catch {
      setCouponDiscount(0);
      setCouponMessage("Could not check that code. Please try again.");
    } finally {
      setCouponChecking(false);
    }
  }

  if (confirmed) {
    return (
      <div className="card-luxury mx-auto max-w-lg p-10 text-center animate-fade-in-scale">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 animate-pulse-glow">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">Booking received</h2>
        <p className="mt-2 text-sm text-muted">
          Your booking reference is <span className="font-bold text-charcoal">{confirmed}</span>.
          Our team will confirm your appointment shortly.
        </p>
        <div className="mt-6 rounded-xl bg-pastel-pink p-4 text-left text-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <p><span className="font-semibold">Service:</span> {selectedItem?.name}</p>
          <p className="mt-1"><span className="font-semibold">Date:</span> {date}</p>
          <p className="mt-1"><span className="font-semibold">Time:</span> {time}</p>
          {staffId && (
            <p className="mt-1">
              <span className="font-semibold">Specialist:</span>{" "}
              {staff.find((s) => s.id === staffId)?.name}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push(`/track-booking?q=${encodeURIComponent(confirmed)}`)}
            className="btn-primary"
          >
            <PackageSearch className="h-4 w-4" />
            Track Booking Status
          </button>
          <button onClick={() => router.push("/customer")} className="btn-outline">
            View my bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator with luxury styling */}
      <ol className="mb-8 flex items-center justify-between stagger-entrance">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                i < step
                  ? "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : i === step
                    ? "bg-rose-gold text-white shadow-[0_0_12px_rgba(183,110,121,0.4)] animate-pulse-glow"
                    : "bg-charcoal/10 text-muted",
              )}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-charcoal" : "text-muted")}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className={cn("mx-2 h-px flex-1 transition-colors", i < step ? "bg-emerald-500" : "bg-charcoal/10")} />
            )}
          </li>
        ))}
      </ol>

      {/* Step 0: service / package */}
      {step === 0 && (
        <div className="space-y-6 stagger-entrance">
          <div className="flex gap-2">
            {(["service", "package"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition-all duration-200",
                  kind === k
                    ? "bg-rose-gold text-white shadow-[0_4px_14px_rgba(183,110,121,0.3)]"
                    : "bg-pastel-pink text-charcoal hover:bg-rose-gold-light hover:shadow-soft",
                )}
              >
                {k === "service" ? "Single Service" : "Package"}
              </button>
            ))}
          </div>

          {kind === "service" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.slug)}
                  className={cn(
                    "card-luxury flex items-center justify-between gap-3 p-4 text-left transition-all duration-300",
                    selectedService === s.slug
                      ? "border-rose-gold ring-2 ring-rose-gold/30 bg-rose-gold/5"
                      : "hover:border-rose-gold/40 hover:shadow-card",
                  )}
                >
                  <div>
                    <p className="text-xs text-rose-gold font-medium">{s.categoryName}</p>
                    <p className="font-semibold">{s.name}</p>
                    <p className="mt-1 text-xs text-muted">{s.durationMin} min</p>
                  </div>
                  <span className="text-sm font-bold text-rose-gold">{money(s.priceCents)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {packages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPackage(p.slug)}
                  className={cn(
                    "card-luxury flex items-center justify-between gap-3 p-4 text-left transition-all duration-300",
                    selectedPackage === p.slug
                      ? "border-rose-gold ring-2 ring-rose-gold/30 bg-rose-gold/5"
                      : "hover:border-rose-gold/40 hover:shadow-card",
                  )}
                >
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="mt-1 text-xs text-muted">{p.durationMin} min</p>
                  </div>
                  <span className="text-sm font-bold text-rose-gold">{money(p.priceCents)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: date & time */}
      {step === 1 && (
        <div className="space-y-6 stagger-entrance">
          <div>
            <label className="field-label flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose-gold" /> Select date
            </label>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => { setDate(e.target.value); setTime(""); }}
              className={cn("field-input", fieldErrors.date && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20")}
            />
            {fieldErrors.date && <p className="mt-1 text-xs text-rose-600">{fieldErrors.date}</p>}
            <p className="mt-1 text-xs text-muted">Bookings open 60 days in advance.</p>
          </div>

          <div>
            <label className="field-label flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-gold" /> Available time slots
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TIME_SLOTS.map((slot) => {
                const info = slotInfo.get(slot);
                const full = info ? !info.available : false;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => !full && setTime(slot)}
                    disabled={full}
                    title={full ? "All specialists are booked" : info ? `${info.remaining} left` : undefined}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      full
                        ? "cursor-not-allowed border-charcoal/10 bg-charcoal/5 text-muted line-through"
                        : time === slot
                          ? "border-rose-gold bg-rose-gold text-white shadow-[0_4px_14px_rgba(183,110,121,0.3)]"
                          : "border-charcoal/10 bg-white text-charcoal hover:border-rose-gold hover:shadow-soft",
                    )}
                  >
                    {slot}
                    {full && <span className="sr-only"> (full)</span>}
                  </button>
                );
              })}
            </div>
            {availability && (
              <p className="mt-2 text-xs text-muted">
                {availability.capacity} specialist{availability.capacity === 1 ? "" : "s"} available per
                time slot. Slots marked as struck through are fully booked.
              </p>
            )}
            {fieldErrors.time && <p className="mt-1 text-xs text-rose-600">{fieldErrors.time}</p>}
          </div>

          <div>
            <label className="field-label flex items-center gap-2">
              <User className="h-4 w-4 text-rose-gold" /> Preferred specialist (optional)
            </label>
            <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="field-input">
              <option value="">No preference</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.jobTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2: customer details */}
      {step === 2 && (
        <div className="space-y-4 stagger-entrance">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={cn("field-input", fieldErrors.name && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20")}
                placeholder="Your name"
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-rose-600">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={cn("field-input", fieldErrors.phone && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20")}
                placeholder="Your phone number"
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-rose-600">{fieldErrors.phone}</p>}
            </div>
          </div>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={cn("field-input", fieldErrors.email && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20")}
              placeholder="you@example.com"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="field-label">Notes (optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="field-input resize-none"
              placeholder="Anything we should know?"
            />
          </div>
        </div>
      )}

      {/* Step 3: review */}
      {step === 3 && selectedItem && (
        <div className="card-luxury space-y-4 p-6 stagger-entrance">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-gold/10 text-rose-gold">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Review your booking</h3>
          </div>
          <dl className="space-y-3 text-sm divide-y divide-charcoal/5">
            <div className="flex justify-between py-2">
              <dt className="text-muted">Service</dt>
              <dd className="font-semibold">{selectedItem.name}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Date</dt>
              <dd className="font-semibold">{date}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Time</dt>
              <dd className="font-semibold">{time}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Duration</dt>
              <dd className="font-semibold">{selectedItem.durationMin} min</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Specialist</dt>
              <dd className="font-semibold">{staffId ? staff.find((s) => s.id === staffId)?.name : "No preference"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted">Estimated total</dt>
              <dd className="font-semibold text-rose-gold text-lg">{money(selectedItem.priceCents)}</dd>
            </div>
          </dl>

          {/* Coupon */}
          <div className="space-y-2 pt-2">
            <label className="field-label flex items-center gap-2">
              <Tag className="h-4 w-4 text-rose-gold" /> Promo code (optional)
            </label>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="BRIDAL10"
                className="field-input flex-1 font-mono uppercase"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponChecking || !couponCode.trim()}
                className="btn-outline shrink-0"
              >
                {couponChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </button>
            </div>
            {couponMessage && (
              <p className="text-xs font-medium text-rose-gold animate-fade-in-up">{couponMessage}</p>
            )}
          </div>

          {couponDiscount > 0 && (
            <div className="space-y-1.5 rounded-xl bg-pastel-pink p-3 text-sm animate-fade-in-scale">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{money(selectedItem.priceCents)}</span>
              </div>
              <div className="flex justify-between font-medium text-emerald-700">
                <span>Discount</span>
                <span>-{money(couponDiscount)}</span>
              </div>
              <div className="flex justify-between border-t border-charcoal/10 pt-1.5 font-bold text-lg">
                <span>Total</span>
                <span className="text-rose-gold">
                  {money(Math.max(0, selectedItem.priceCents - couponDiscount))}
                </span>
              </div>
            </div>
          )}
          <p className="rounded-xl bg-pastel-pink p-3 text-xs text-muted">
            <Sparkles className="mr-1 inline h-3.5 w-3.5 text-rose-gold" />
            Final pricing is confirmed during consultation. This booking is a request and will be
            confirmed by our team.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 animate-fade-in-up">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => { if (validateStep()) setStep((s) => s + 1); }}
            disabled={!canContinue()}
            className="btn-primary"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className="btn-primary">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Confirm booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}