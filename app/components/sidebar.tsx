// components/Sidebar.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar as AceternitySidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconFolder, // For Category icon
  IconBox,    // For Product icon
  IconPlus,   // For Add New
  IconTrash,  // For Delete
  IconPencil, // For Update
  IconEye,    // For Show All
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Link {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarProps {
  initialOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ initialOpen = false }) => {
  const [open, setOpen] = useState(initialOpen);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  // Main links excluding Logout
  const mainLinks: Link[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Logout link defined separately
  const logoutLink: Link = {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  // Dropdown items for Category and Product
  const categoryDropdown = [
    { label: "Add New Category", href: "/admin/categories/add-category", icon: <IconPlus className="h-4 w-4" /> },
    { label: "Delete Category", href: "/admin/categories/delete-category", icon: <IconTrash className="h-4 w-4" /> },
    { label: "Update Category", href: "/admin/categories/edit-category", icon: <IconPencil className="h-4 w-4" /> },
    { label: "Show All Categories", href: "/admin/categories/all-categories", icon: <IconEye className="h-4 w-4" /> },
  ];

  const productDropdown = [
    { label: "Add New Product", href: "/admin/products/add-product", icon: <IconPlus className="h-4 w-4" /> },
    { label: "Delete Product", href: "/admin/products/delete-product", icon: <IconTrash className="h-4 w-4" /> },
    { label: "Update Product", href: "/admin/products/edit-product", icon: <IconPencil className="h-4 w-4" /> },
    { label: "Show All Products", href: "/admin/products/all-products", icon: <IconEye className="h-4 w-4" /> },
  ];

  // Animation variants for the dropdowns
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  const dropdownTransition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <AceternitySidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {/* Main Links */}
            {mainLinks.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center"
              />
            ))}

            {/* Category Dropdown */}
            <div className="relative right-2">
              <div
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-md p-2 flex items-center"
                onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
              >
                <SidebarLink
                  link={{
                    label: "Category",
                    href: "#",
                    icon: (
                      <IconFolder className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                  }}
                  className="hover:bg-transparent flex items-center"
                />
              </div>
              <AnimatePresence>
                {activeDropdown === "category" && open && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={dropdownTransition}
                    className="pl-4 mt-2 space-y-2 overflow-hidden pr-2"
                  >
                    {categoryDropdown.map((item, idx) => (
                      <SidebarLink
                        key={idx}
                        link={item}
                        className="pl-6 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm flex items-center"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Dropdown */}
            <div className="relative right-2">
              <div
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-md p-2 flex items-center"
                onClick={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
              >
                <SidebarLink
                  link={{
                    label: "Product",
                    href: "#",
                    icon: (
                      <IconBox className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                  }}
                  className="hover:bg-transparent flex items-center"
                />
              </div>
              <AnimatePresence>
                {activeDropdown === "product" && open && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={dropdownTransition}
                    className="pl-4 mt-2 space-y-2 overflow-hidden"
                  >
                    {productDropdown.map((item, idx) => (
                      <SidebarLink
                        key={idx}
                        link={item}
                        className="pl-6 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm flex items-center"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Link (always last) */}
            <div
              onClick={handleLogout}
              className="cursor-pointer flex items-center"
            >
              <SidebarLink
                link={logoutLink}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: "",
            }}
            className="hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center"
          />
          {open && (
            <div className="px-4 text-xs text-neutral-500 dark:text-neutral-400">
              Aceternity UI Demo
            </div>
          )}
        </div>
      </SidebarBody>
    </AceternitySidebar>
  );
};

// Logo components remain unchanged
const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 mr-2" />
    </Link>
  );
};