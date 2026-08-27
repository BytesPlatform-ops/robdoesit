"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  bookingSchema,
  stepFields,
  EVENT_TYPES,
  NEEDS,
  type BookingInput,
} from "@/lib/validation";
import { Field, inputClass, Chip } from "./Field";
import { Mic } from "@/components/layout/Logo";
import { EASE_CINE } from "@/lib/animations";

const STEP_TITLES = [
  "WHAT'S HAPPENING?",
  "WHEN AND WHERE?",
  "WHAT DO YOU NEED?",
  "YOUR DETAILS",
  "ANYTHING ROB SHOULD KNOW?",
];

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: { needs: [], website: "" },
  });

  const needs = useWatch({ control, name: "needs" }) ?? [];
  const eventType = useWatch({ control, name: "eventType" });
  const last = step === STEP_TITLES.length - 1;

  const go = async (dir: 1 | -1) => {
    if (dir === -1) return setStep((s) => Math.max(0, s - 1));
    const ok = await trigger(stepFields[step] as (keyof BookingInput)[]);
    if (ok) setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };

  const onSubmit = async (data: BookingInput) => {
    setState("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border border-gold/30 bg-ink px-6 py-20 text-center sm:px-12 sm:py-28"
        role="status"
      >
        <motion.span
          className="mx-auto mb-8 block h-10 w-10 text-gold"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_CINE }}
        >
          <Mic />
        </motion.span>
        <motion.span
          className="mx-auto mb-10 block h-px bg-gold"
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_CINE }}
        />
        <h3 className="display text-[clamp(2rem,6vw,4.5rem)] leading-[0.9]">
          {["YOU'RE ON ROB'S RADAR.", "WE'LL TAKE IT FROM HERE."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: EASE_CINE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h3>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative border border-hairline-strong bg-ink"
    >
      {/* progress */}
      <div className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5 sm:px-10">
        <span className="mono text-gold">
          STEP {String(step + 1).padStart(2, "0")}
          <span className="text-steel-dk"> / {String(STEP_TITLES.length).padStart(2, "0")}</span>
        </span>
        <div className="h-px flex-1 bg-hairline-strong">
          <motion.div
            className="h-px bg-gold"
            animate={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE_CINE }}
          />
        </div>
      </div>

      <div className="px-6 py-10 sm:px-10 sm:py-14">
        <AnimatePresence mode="wait">
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: EASE_CINE }}
            className="min-h-[290px]"
          >
            <legend className="display mb-10 text-[clamp(1.75rem,4vw,3rem)] leading-none">
              {STEP_TITLES[step]}
            </legend>

            {step === 0 && (
              <div className="grid gap-8">
                <Field label="EVENT NAME" name="eventName" error={errors.eventName?.message}>
                  <input
                    id="eventName"
                    className={inputClass}
                    placeholder="What is it called?"
                    aria-invalid={!!errors.eventName}
                    {...register("eventName")}
                  />
                </Field>

                <Field label="EVENT TYPE" name="eventType" error={errors.eventType?.message}>
                  <div className="flex flex-wrap gap-2 pt-1" role="radiogroup" aria-label="Event type">
                    {EVENT_TYPES.map((t) => (
                      <Chip
                        key={t}
                        type="radio"
                        value={t}
                        active={eventType === t}
                        {...register("eventType")}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="EVENT DATE" name="eventDate" error={errors.eventDate?.message}>
                  <input
                    id="eventDate"
                    type="date"
                    className={`${inputClass} [color-scheme:dark]`}
                    aria-invalid={!!errors.eventDate}
                    {...register("eventDate")}
                  />
                </Field>
                <Field label="CITY" name="city" error={errors.city?.message}>
                  <input
                    id="city"
                    className={inputClass}
                    placeholder="Los Angeles"
                    aria-invalid={!!errors.city}
                    {...register("city")}
                  />
                </Field>
                <Field
                  label="VENUE"
                  name="venue"
                  error={errors.venue?.message}
                  className="sm:col-span-2"
                >
                  <input
                    id="venue"
                    className={inputClass}
                    placeholder="Where is it happening?"
                    aria-invalid={!!errors.venue}
                    {...register("venue")}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <Field
                label="PICK EVERYTHING THAT APPLIES"
                name="needs"
                error={errors.needs?.message as string | undefined}
              >
                <div className="flex flex-wrap gap-2 pt-1">
                  {NEEDS.map((n) => (
                    <Chip
                      key={n}
                      type="checkbox"
                      value={n}
                      active={needs.includes(n)}
                      {...register("needs")}
                    >
                      {n}
                    </Chip>
                  ))}
                </div>
              </Field>
            )}

            {step === 3 && (
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="NAME" name="name" error={errors.name?.message}>
                  <input id="name" className={inputClass} aria-invalid={!!errors.name} {...register("name")} />
                </Field>
                <Field label="COMPANY (OPTIONAL)" name="company">
                  <input id="company" className={inputClass} {...register("company")} />
                </Field>
                <Field label="EMAIL" name="email" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                </Field>
                <Field label="PHONE (OPTIONAL)" name="phone">
                  <input id="phone" type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />
                </Field>
                <Field
                  label="INSTAGRAM / WEBSITE (OPTIONAL)"
                  name="handle"
                  className="sm:col-span-2"
                >
                  <input id="handle" className={inputClass} {...register("handle")} />
                </Field>
              </div>
            )}

            {step === 4 && (
              <Field
                label="THE DETAILS THAT MATTER"
                name="message"
                hint="Vibe, guests, run of show, what you want people talking about after."
              >
                <textarea
                  id="message"
                  rows={5}
                  className={`${inputClass} resize-none`}
                  {...register("message")}
                />
              </Field>
            )}
          </motion.fieldset>
        </AnimatePresence>

        {/* honeypot — hidden from people, catnip for bots */}
        <div aria-hidden className="absolute left-[-9999px] top-0">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <p aria-live="polite" className="sr-only">
          Step {step + 1} of {STEP_TITLES.length}: {STEP_TITLES[step]}
        </p>

        {state === "error" && (
          <p role="alert" className="mono mt-8 text-gold">
            THAT DIDN&apos;T GO THROUGH — TRY AGAIN, OR REACH ROB ON INSTAGRAM.
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => go(-1)}
              className="border border-hairline-strong px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:border-ivory/40 hover:text-ivory"
            >
              ← BACK
            </button>
          )}

          {/* Distinct keys matter: without them React patches this one
              element from type="button" to type="submit" while the click
              is still in flight, and the browser then submits the form on
              the step-four "keep going" press. preventDefault backs it up. */}
          {!last ? (
            <button
              key="next"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                go(1);
              }}
              data-cursor="NEXT"
              className="group inline-flex items-center gap-3 bg-ivory px-8 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi"
            >
              KEEP GOING
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          ) : (
            <button
              key="submit"
              type="submit"
              disabled={state === "sending"}
              data-cursor="LET'S GO"
              className="group inline-flex items-center gap-3 bg-gold px-8 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi disabled:opacity-60"
            >
              {state === "sending" ? "SENDING…" : "LET'S MAKE IT HAPPEN"}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
