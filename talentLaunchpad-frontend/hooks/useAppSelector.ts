import { TypedUseSelectorHook, useSelector } from "react-redux";
import { Rootstate } from "@/config/store";

export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector;