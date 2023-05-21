import UNIVERSAL from "@/config/config";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props<T> {
    results?: T[];
    renderItem(item: string): JSX.Element;
    onChange?: React.ChangeEventHandler;
    onSelect?: (item: string) => void;
    value?: string;
}

const LocationSearch = <T extends object>({
    renderItem,
    value,
    onSelect,
}: Props<T>): JSX.Element => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const resultContainer = useRef<HTMLDivElement>(null);
    const [showResults, setShowResults] = useState(false);
    const [defaultValue, setDefaultValue] = useState("");
    const [results, setResults] = useState<string[]>([]);

    // const handleChange: changeHandler = (e) => {
    //     const { target } = e;
    //     if (!target.value.trim()) return setResults([]);

    //     const filteredValue = profiles.filter((profile) =>
    //         profile.name.toLowerCase().startsWith(target.value)
    //     );
    //     setResults(filteredValue);
    // };


    const handleSelection = (selectedIndex: number) => {
        const selectedItem = results[selectedIndex];
        if (!selectedItem) return resetSearchComplete();
        onSelect && onSelect(selectedItem);
        resetSearchComplete();
    };

    const resetSearchComplete = useCallback(() => {
        setFocusedIndex(-1);
        setShowResults(false);
    }, []);

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        const { key } = e;
        let nextIndexCount = 0;

        // move down
        if (key === "ArrowDown")
            nextIndexCount = (focusedIndex + 1) % results?.length;

        // move up
        if (key === "ArrowUp")
            nextIndexCount = (focusedIndex + results?.length - 1) % results?.length;

        // hide search results
        if (key === "Escape") {
            resetSearchComplete();
        }

        // select the current item
        if (key === "Enter") {
            e.preventDefault();
            handleSelection(focusedIndex);
        }

        setFocusedIndex(nextIndexCount);
    };

    type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
    const handleChange: changeHandler = (e) => {
        setDefaultValue(e.target.value);

        const { target } = e;
        if (!target.value.trim()) return setResults([]);



        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?proximity=ip&access_token=${UNIVERSAL.MAP_BOX_KEY}`)
            .then(res => res.json())
            .then(res => {
                let places = res?.features?.map((item: any) => {
                    return item.place_name
                })

                setResults(places);
            })

    };

    useEffect(() => {
        if (!resultContainer.current) return;

        resultContainer.current.scrollIntoView({
            block: "center",
        });
    }, [focusedIndex]);

    useEffect(() => {
        if (results?.length > 0 && !showResults) setShowResults(true);

        if (results?.length <= 0) setShowResults(false);
    }, [results]);

    useEffect(() => {
        if (value) setDefaultValue(value);
    }, [value]);


    return (

        <div
            tabIndex={1}
            onBlur={resetSearchComplete}
            onKeyDown={handleKeyDown}
            className="relative"
        >
            <input
                value={defaultValue}
                onChange={handleChange}
                type="text"
                className="focus:bg-white w-full focus:border border-blue-600 transition duration-200 outline-none bg-gray-100 py-3 px-2 rounded-md"
                placeholder="Search your query..."
            />

            {/* Search Results Container */}
            {showResults && (
                <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
                    {results.map((item, index) => {
                        return (
                            <div
                                key={index}
                                onMouseDown={() => handleSelection(index)}
                                ref={index === focusedIndex ? resultContainer : null}
                                style={{
                                    backgroundColor:
                                        index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                                }}
                                className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                            >
                                {renderItem(item)}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

    );
};

export default LocationSearch;