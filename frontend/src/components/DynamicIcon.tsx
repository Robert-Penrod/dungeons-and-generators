// DynamicIcon.tsx
import React from "react";
import type { IconBaseProps, IconType } from "react-icons";
import * as Fa from "react-icons/fa";
import * as Gi from "react-icons/gi";
import * as Md from "react-icons/md";

const PACKS: Record<string, Record<string, IconType>> = {
    fa: Fa as unknown as Record<string, IconType>,
    gi: Gi as unknown as Record<string, IconType>,
    md: Md as unknown as Record<string, IconType>,
};

const PACK_PREFIX: Record<string, string> = { fa: "Fa", gi: "Gi", md: "Md" };

function toPascalCase(s: string) {
    return s
        .split(/[^a-zA-Z0-9]+/g)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
}

function normalizeExportName(prefix: string, rawExport: string) {
    const packPrefix = PACK_PREFIX[prefix] ?? "";
    const trimmed = rawExport.trim();

    if (!trimmed) return "";

    // Already PascalCase and starts with the correct pack prefix
    if (/^[A-Z]/.test(trimmed) && trimmed.startsWith(packPrefix)) {
        return trimmed; // e.g., "FaCoins"
    }
    // PascalCase but missing pack prefix
    if (/^[A-Z]/.test(trimmed)) {
        return packPrefix + trimmed; // "Coins" -> "FaCoins"
    }
    // Lower/kebab/snake -> PascalCase and prepend pack prefix
    return packPrefix + toPascalCase(trimmed);
}

export interface DynamicIconProps extends IconBaseProps {
    /** e.g. "fa:FaBeer", "gi:GiTorch", "md:MdHome", "fa:coins", "gi:torch" */
    name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
    const getIcon = (spec: string): IconType | undefined => {
        const [rawPrefix = "", rawExport = ""] = spec.split(":");
        const prefix = rawPrefix.trim().toLowerCase();
        const pack = PACKS[prefix];
        if (!pack) return undefined;

        const exportKey = normalizeExportName(prefix, rawExport);
        return exportKey ? pack[exportKey] : undefined;
    };

    const Icon = getIcon(name);
    if (!Icon) return null; // ← render nothing if not found

    return <Icon {...props} />;
};

export default DynamicIcon;
