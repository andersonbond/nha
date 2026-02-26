"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/applications", label: "Applications", icon: DocumentTextIcon },
  { href: "/beneficiaries", label: "Beneficiaries", icon: UserGroupIcon },
  { href: "/projects", label: "Projects", icon: FolderIcon },
  { href: "/programs", label: "Programs", icon: ClipboardDocumentListIcon },
  { href: "/lot-management", label: "Lot Management", icon: MapPinIcon },
  { href: "/landholdings", label: "Landholdings Inventory", icon: BuildingOffice2Icon },
  { href: "/ciim", label: "CIIM", icon: BuildingStorefrontIcon },
  //{ href: "/lot-award-documentation", label: "Lot Award Documentation", icon: DocumentCheckIcon },
  { href: "/approval-workflow", label: "Approval Workflow", icon: ClipboardDocumentCheckIcon },
  { href: "/reports", label: "Reports", icon: ChartBarIcon },
  { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const isCollapsedOnDesktop = collapsed === true;

  return (
    <>
      {/* Overlay on mobile when open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-hidden
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark
          transition-transform duration-200 ease-out
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsedOnDesktop ? "md:-translate-x-full" : "md:translate-x-0"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-subtle)] px-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="LIS Home">
            <Image
              src="/logo.jpg"
              alt="LIS"
              width={40}
              height={40}
              className="rounded object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 md:hidden text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-auto p-2" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {onToggleCollapse && !isCollapsedOnDesktop && (
          <div className="mt-auto border-t border-[var(--border-subtle)] p-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Hide sidebar"
            >
              <ChevronLeftIcon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Hide sidebar</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick, "aria-label": ariaLabel }: { onClick: () => void; "aria-label"?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md p-2 text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
      aria-label={ariaLabel ?? "Open menu"}
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  );
}
