import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, Loader2, Lock } from "lucide-react";

import { applicationSchema, emptyApplication } from "../lib/schema";
import type { ApplicationValues } from "../lib/schema";
import { submitApplication } from "../lib/submit";
import { LOCAL_COMMITTEES } from "../data/localCommittees";
import { TextField, SelectField } from "./Field";
import SuccessState from "./SuccessState";
import { DEADLINE } from "./Countdown";

/**
 * The application form as a self-contained, prominent card. It's designed to sit
 * beside the hero copy so it's visible above the fold.
 */
export default function RecruitmentForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyApplication,
    mode: "onBlur",
  });

  const onSubmit = async (values: ApplicationValues) => {
    setSubmitError(null);
    // The form collects the local number only; re-attach the +216 country code
    // (shown as a fixed prefix) so the sheet stores the full number.
    const result = await submitApplication({
      ...values,
      phone: `+216 ${values.phone}`,
    });
    if (result.ok) {
      setSubmitted(true);
      reset(emptyApplication);
    } else {
      setSubmitError(result.error);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmitError(null);
  };

  const isClosed = Date.now() > DEADLINE.getTime();

  return (
    <div
      id="apply"
      className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl ring-1 ring-black/5"
    >
      {isClosed ? (
        <div className="flex flex-col items-center px-6 py-14 text-center sm:px-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slateink/10 text-slateink">
            <Lock className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-5 text-xl font-black text-ink">Applications are closed</h2>
          <p className="mt-2 max-w-sm text-slateink">
            Recruitment closed on 20 July 2026. Follow AIESEC in Tunisia on social media
            to hear about the next intake.
          </p>
        </div>
      ) : submitted ? (
        <SuccessState onReset={resetForm} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="border-b border-hairline bg-mist/60 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-black text-ink sm:text-2xl">
              Apply to join AIESEC
            </h2>
            <p className="mt-1 text-sm text-slateink">
              Takes two minutes. Applications close{" "}
              <span className="font-semibold text-aiesec">20 July 2026</span>.
            </p>
          </div>

          <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-7">
            <TextField
              id="name"
              label="Full name"
              placeholder="e.g. Yasmine Ben Ali"
              autoComplete="name"
              registration={register("name")}
              error={errors.name?.message}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="email"
                label="Email"
                type="email"
                inputMode="email"
                placeholder="you@email.com"
                autoComplete="email"
                registration={register("email")}
                error={errors.email?.message}
              />
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                inputMode="tel"
                prefix="+216"
                placeholder="20 123 456"
                autoComplete="tel"
                registration={register("phone")}
                error={errors.phone?.message}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                id="lc"
                label="Local Committee"
                placeholder="Choose your LC"
                options={LOCAL_COMMITTEES}
                registration={register("lc")}
                error={errors.lc?.message}
              />
              <TextField
                id="university"
                label="University / School"
                placeholder="e.g. ENIT, IHEC, FSEG…"
                autoComplete="organization"
                registration={register("university")}
                error={errors.university?.message}
              />
            </div>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-sunset/30 bg-sunset/8 px-4 py-3 text-sm font-medium text-sunset"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-aiesec px-7 py-4 text-base font-bold text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5 hover:bg-aiesec-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                <>
                  Submit application
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden
                  />
                </>
              )}
            </button>

            <p className="text-center text-xs leading-relaxed text-slateink">
              By applying you agree to be contacted by AIESEC in Tunisia about your
              application.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
