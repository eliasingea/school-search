import "./App.css";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
} from "react-instantsearch-hooks-web";
import React from "react";
import { useState } from "react";

import { useConnector } from "react-instantsearch-hooks-web";
import connectStats from "instantsearch.js/es/connectors/stats/connectStats";

const searchClient = algoliasearch(
  "NCJSK5LPL6",
  "8648ca4529e31fb962d34a8738ce368a"
);

export function useStats(props) {
  return useConnector(connectStats, props);
}

export function Stats(props) {
  const { nbHits } = useStats(props);

  return (
    <div className="container mx-auto m-10">
      <p className="text-1xl text-gray-700 font-bold">
        {nbHits} Programs Found
      </p>
    </div>
  );
}

function Hit({ hit }) {
  let program;
  if (hit.program) {
    program = <Highlight attribute="program" hit={hit} />;
  } else {
    program = <Highlight attribute="Program Type" hit={hit} />;
  }
  let duration;
  if (hit.length) {
    duration = hit["length"];
  } else {
    duration = "12 months";
  }
  return (
    <div className="container mx-auto bg-white rounded-xl shadow border m-10 flex">
      <div className="flex-auto w-64">
        <p className="text-1xl text-gray-700 font-bold mb-1 sm:p-7 pt-4 pr-6 pl-6">
          <Highlight attribute="title" hit={hit} />
        </p>
        <div className="w-[calc(100%_-_2rem)] border-t-2 border-dashed border-gray-300 ml-7 invisible md:visible"></div>
        <div className="pl-7 pr-7 pt-4 pb-4">
          <p className="text-gray-500">
            <span className="font-bold">program type: </span>
            {program}
          </p>
          <p className="text-gray-500">
            <span className="font-bold">duration: </span>
            {duration}
          </p>
          {hit.state && (
            <p className="text-gray-500">
              <span className="font-bold">state: </span>
              <Highlight attribute="state" hit={hit} />
            </p>
          )}
          {hit.match && (
            <p className="text-gray-500">
              <span className="font-bold">Participates in Match: </span>
              {hit.match}
            </p>
          )}
          {hit.deadline && (
            <p className="text-gray-500">
              <span className="font-bold">Deadline: </span>
              {hit.deadline}
            </p>
          )}
          {hit.start_on && (
            <p className="text-gray-500">
              <span className="font-bold">Start Date: </span>
              {hit.start_on}
            </p>
          )}
          {hit.available_positions && (
            <p className="text-gray-500">
              <span className="font-bold">Available Positions: </span>
              {hit.available_positions}
            </p>
          )}
          <p className="text-gray-500 font-bold pb-1">Keywords</p>
          {hit._snippetResult?.keywords &&
            Array.from(hit._snippetResult.keywords)
              .slice(0, 5)
              .map((keywords) => {
                return (
                  <p
                    key={keywords.value}
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{ __html: keywords.value }}
                  ></p>
                );
              })}
          <a
            href={hit.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 font-bold"
          >
            link to program
          </a>
        </div>
      </div>
      {/* <div className="flex-auto w-32 invisible sm:visible">
        <img
          src="/better-uni.png"
          alt="toothbrush"
          className="h-150 w-50"
        ></img>
      </div> */}
    </div>
  );
}

function App() {
  const monthNames = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const sortByName = (a, b) => {
    let aStr = a.name.replace(",", "");
    let bStr = b.name.replace(",", "");
    let aSplit = aStr.split(" ");
    let bSplit = bStr.split(" ");
    let aDate = new Date(aSplit[2], monthNames[aSplit[0]], aSplit[1]);
    let bDate = new Date(bSplit[2], monthNames[bSplit[0]], bSplit[1]);

    return aDate < bDate ? -1 : 1;
  };

  const [showMenu, setMenu] = useState("invisible w-0");
  const [showResults, setResults] = useState("visible w-full");

  return (
    <InstantSearch searchClient={searchClient} indexName="aegd">
      <div className="md:container md:mx-auto flex items-start md:justify-center md:mt-8 justify-between mt-4">
        <SearchBox
          placeholder="Search for programs..."
          classNames={{
            root: "relative w-3/5 float-left ml-[20px]",
            input:
              "block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            submitIcon:
              "invisible md:visible text-white absolute right-2.5 bottom-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
          }}
          submitIconComponent={({ classNames }) => (
            <div className={classNames.submitIcon}>Submit</div>
          )}
          resetIconComponent={({ classNames }) => <></>}
        />
        <div
          onClick={() => {
            console.log("hello");
            showMenu === "visible w-full"
              ? setMenu("invisible w-0")
              : setMenu("visible w-full");
            showResults === "visible w-full"
              ? setResults("hidden w-0")
              : setResults("visible w-full");
          }}
          class="visible sm:invisible p-4 space-y-2 bg-gray-600 rounded shadow float-right mr-[20px]"
        >
          <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
          <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
          <span class="block w-8 h-0.5 bg-gray-100 animate-pulse"></span>
        </div>
      </div>

      <div className="flex w-full">
        <div className={`${showMenu} sm:visible sm:w-1/3 flex-inital sm:m-10`}>
          <div className="p-3">
            <p className="text-gray-700 font-bold">Program Type</p>
            <RefinementList
              attribute="program"
              showMore={true}
              sortBy={["count"]}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2 rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>
          <div className="p-3">
            <p className="text-gray-700 font-bold">Keywords</p>
            <RefinementList
              attribute="keywords"
              showMore={true}
              showMoreLimit={40}
              sortBy={["count"]}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2 rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>
          <div className="p-3">
            <p className="text-gray-700 font-bold">State</p>
            <RefinementList
              attribute="state"
              showMoreLimit={30}
              showMore={true}
              sortBy={["count"]}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2   rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>
          <div className="p-3">
            <p className="text-gray-700 font-bold">Match</p>
            <RefinementList
              attribute="match"
              sortBy={["count"]}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2   rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>
          <div className="p-3">
            <p className="text-gray-700 font-bold">Positions</p>
            <RefinementList
              attribute="available_positions"
              sortBy={["label"]}
              showMore={true}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2   rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>

          <div className="p-3">
            <p className="text-gray-700 font-bold">Deadline</p>
            <RefinementList
              attribute="deadline"
              sortBy={sortByName}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                searchBox: "border-2   rounded-md w-[15rem] mb-3",
                showMore:
                  "border rounded-md bg-sky-500 mt-5 p-2 ml-10  text-gray-700",
                item: "cursor-pointer",
              }}
            />
          </div>
          {/* todo: fix duration */}
          <div className="p-3">
            <p className="text-gray-700 font-bold">Duration</p>
            <RefinementList
              attribute="length"
              sortBy={["count"]}
              classNames={{
                checkbox: "mr-1",
                labelText: "ml-2 text-gray-700 cursor-pointer",
                count:
                  "ml-2 bg-sky-100 border rounded-md pl-3 pr-3 text-gray-500",
                root: "mt-5",
                item: "cursor-pointer",
              }}
            />
          </div>
        </div>
        <div
          className={`${showResults} sm:visible flex-initial sm:w-4/5 sm:pr-40 p-4`}
        >
          <div className="container mx-auto m-10">
            <p className="text-2xl text-gray-700 font-bold">Explore Programs</p>
            <p>Results are based on top matches and on your filters.</p>
          </div>
          <Stats />
          <Hits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  );
}
export default App;
