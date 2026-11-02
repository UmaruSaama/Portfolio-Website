/** Shared by the appendix panel (client) and appendix content (server). */

export type AppendixSection = { id: string; label: string };

/** DOM id of an appendix section (inside the panel). */
export const appendixAnchor = (id: string) => `appendix-${id}`;
