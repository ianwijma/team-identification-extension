import { Suspense } from "react";
import { OptionsContent } from "./content";

export const generateStaticParams = async () => ([]);

const Options = () => <Suspense>
    <OptionsContent />
</Suspense>

export default Options;