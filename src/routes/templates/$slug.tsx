/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import { useState } from "react";

import classNames from "clsx";

import { Link, useParams, useRouteError } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import { ReportTemplate, reportTemplates } from "../../constants";
import { isZodError } from "../../utils";

function constructZendeskUrl(
  reportTemplate: ReportTemplate,
  formState: Record<string, string>
) {
  const url = new URL("https://support.discord.com/hc/en-us/requests/new");

  url.searchParams.set(
    "ticket_form_id",
    reportTemplate.ticketFormId.toString()
  );

  const subject = reportTemplate.prefilledValues.subject
    .replace(/\{(.+?)\}/g, (_, key) => formState[key])
    .trim();

  const description = reportTemplate.prefilledValues.description
    .replace(/\{(.+?)\}/g, (_, key) => formState[key])
    .trim();

  Object.entries(reportTemplate.prefilledValues).forEach(([key, value]) => {
    if (key === "subject" || key === "description") return;

    url.searchParams.set(`tf_${key}`, value);
  });

  url.searchParams.set("tf_subject", subject);
  url.searchParams.set("tf_description", description);

  return url.toString();
}

export default function ReportTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const report = reportTemplates.find((item) => item.slug === slug);

  const [formState, setFormState] = useState({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!report) throw new Error("Report Form not found");

  const submittable =
    Object.keys(formState).length === Object.keys(report.fields).length &&
    Object.values(errors).every((value) => !value);

  return (
    <div className="flex flex-col gap-y-8">
      <Link
        to="/"
        className="text-indigo-600 dark:text-indigo-400 flex items-center hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="ml-2">Back to Overview</span>
      </Link>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-bold dark:text-white">{report.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{report.description}</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-bold dark:text-white">Report Fields</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Whilst we try to prefill as much as possible, some fields are required
          to be filled out by you. Please fill out the following fields to
          continue.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
          {Object.entries(report.fields).map(([key, value]) => (
            <div key={key} className="col-span-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                {value.label}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name={key}
                  id={key}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white"
                  placeholder={value.example}
                  onChange={(e) => {
                    try {
                      const parsed = value.validation.parse(e.target.value);

                      setErrors((prev) => ({ ...prev, [key]: "" }));
                      setFormState((prev) => ({ ...prev, [key]: parsed }));
                    } catch (err: unknown) {
                      if (isZodError(err)) {
                        setErrors((prev) => ({
                          ...prev,
                          // @ts-expect-error - TypeScript doesn't want to understand that err is of type ZodError
                          [key]: err.errors[0].message,
                        }));
                      }
                    }
                  }}
                />
                {errors[key] ? (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors[key]}
                  </p>
                ) : (
                  value.description && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {value.description}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="col-span-1 sm:col-span-2">
            <a
              className={classNames(
                "text-sm font-medium text-indigo-600 dark:text-indigo-400",
                {
                  "cursor-not-allowed opacity-50": !submittable,
                  "hover:underline": submittable,
                }
              )}
              onClick={(event) => {
                if (!submittable) event.preventDefault();
              }}
              href={
                submittable ? constructZendeskUrl(report, formState) : undefined
              }
              target="_blank"
              rel="noreferrer"
              aria-disabled={!submittable}
            >
              Get Support Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportTemplate.ErrorBoundary = function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          {error.message}
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
