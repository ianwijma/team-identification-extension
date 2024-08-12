import { Suspense } from "react";
import { PopupContent } from "./content";

export const generateStaticParams = async () => ([]);

const Popup = () => <Suspense>
    <PopupContent />
</Suspense>

export default Popup;