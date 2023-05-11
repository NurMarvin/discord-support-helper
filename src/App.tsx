/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex-1">
        <Outlet />
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            © 2023{" "}
            <a
              href="https://nurmarv.in?ref=discord-support-helper"
              className="font-medium text-gray-900 dark:text-white"
            >
              Marvin Witt
            </a>
            . All rights reserved.
          </span>
        </div>
        {/* Not endorsed by Discord, Inc. */}
        <div className="flex justify-center text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <span>
            This website is not endorsed by{" "}
            <a
              href="https://discord.com"
              className="font-medium text-gray-900 dark:text-white"
            >
              Discord
            </a>{" "}
            and does not reflect the views or opinions of Discord or anyone
            officially involved in producing or managing Discord. Discord is a
            trademark or registered trademark of Discord, Inc. Discord ©
            Discord, Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}
