/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import { useState } from "react";

import Fuse from "fuse.js";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

import { reportTemplates } from "../constants";

export default function Overview() {
  const [search, setSearch] = useState("");

  const fuse = new Fuse(reportTemplates, {
    keys: ["name", "description", "tags"],
    threshold: 0.3,
  });

  const results = search
    ? fuse.search(search).map(({ item }) => item)
    : reportTemplates;

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b dark:border-white/5 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                aria-hidden="true"
              />
              <input
                onChange={(e) => setSearch(e.target.value)}
                id="search-field"
                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 dark:text-white focus:ring-0 sm:text-sm placeholder-gray-400 text-gray-900"
                placeholder="Search..."
                value={search}
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
      </div>
      <h1 className="text-2xl font-bold dark:text-white mt-8">
        Report Templates
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        These templates are provided by the community. If you want to add your
        own template, please{" "}
        <a
          href="https://github.com/NurMarvin/discord-support-helper"
          className="font-medium text-gray-900 dark:text-white"
          rel="noopener noreferrer"
          target="_blank"
        >
          contribute on GitHub
        </a>
        .
      </p>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {results.map((item) => (
          <li
            key={item.slug}
            className="group overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800 hover:shadow-md transition duration-200 dark:hover:bg-gray-800"
          >
            <Link
              to={`/templates/${item.slug}`}
              className="block w-full h-full"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 dark:bg-gray-900 dark:border-gray-50/5 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition duration-200">
                <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  {item.name}
                </div>
              </div>
              <p className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
