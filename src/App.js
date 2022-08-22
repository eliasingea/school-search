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
  // function handleKeywords(keywords) {
  //   keywords.sort((a, b) => {
  //     if (
  //       a.matchLevel === "full" &&
  //       (b.matchLevel === "none" || b.matchLevel === "partial")
  //     ) {
  //       return -1;
  //     } else if (a.matchLevel === "partial" && b.matchLevel === "none") {
  //       return -1;
  //     } else if (a.matchLevel === b.matchLevel) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  //   return keywords;
  // }
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
  console.log(hit._snippetResult);
  return (
    <div className="container mx-auto bg-white rounded-xl shadow border m-10 flex">
      <div className="flex-auto w-64">
        <p className="text-1xl text-gray-700 font-bold mb-1 p-7">
          <Highlight attribute="Program Name" hit={hit} />
        </p>
        <div className="w-[calc(100%_-_2rem)] border-t-2 border-dashed border-gray-300 ml-7 invisible md:visible"></div>
        <div className="p-7">
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
              {hit.starts_on}
            </p>
          )}
          {hit.available_positions && (
            <p className="text-gray-500">
              <span className="font-bold">Available Positions: </span>
              {hit.available_positions}
            </p>
          )}
          <p className="text-gray-500 font-bold pb-1">Keywords</p>
          {Array.from(hit._snippetResult.keywords)
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

  return (
    <InstantSearch searchClient={searchClient} indexName="aegd">
      <div className="md:container md:mx-auto flex items-center justify-center mt-8">
        <SearchBox
          placeholder="Search for programs..."
          classNames={{
            root: "relative w-3/5",
            input:
              "block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            submitIcon:
              "text-white absolute right-2.5 bottom-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
          }}
          submitIconComponent={({ classNames }) => (
            <div className={classNames.submitIcon}>Submit</div>
          )}
          resetIconComponent={({ classNames }) => <></>}
        />
      </div>
      <div className="flex w-full">
        <div className="w-1/3 flex-inital m-10">
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
                searchBox: "border-2   rounded-md w-[15rem] mb-3",
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
          <div className="p-3">
            <p className="text-gray-700 font-bold">Duration</p>
            <RefinementList
              attribute="length"
              sortBy={["name:asc"]}
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
        <div className="flex-initial w-4/5 pr-40">
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
