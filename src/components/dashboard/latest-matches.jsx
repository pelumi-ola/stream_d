"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";

const matches = [
  {
    team1: "Argentina",
    team2: "Italy",
    score: "1 - 2",
    flag1: "🇦🇷",
    flag2: "🇮🇹",
    date: "18 December 2022",
    details: {
      stadium: "Lusail Iconic Stadium",
      referee: "Michael Oliver",
      goals: {
        Argentina: ["23' Lautaro Martínez (Á. Di María)"],
        Italy: [
          "45+1' Ciro Immobile (assist: L. Insigne)",
          "78' Federico Chiesa (assist: M. Verratti)",
        ],
      },
      substitutions: {
        Argentina: [
          "60' Paulo Dybala ↔ Á. Di María",
          "72' Leandro Paredes ↔ R. De Paul",
        ],
        Italy: [
          "65' Domenico Berardi ↔ L. Insigne",
          "82' Jorginho ↔ M. Verratti",
        ],
      },
    },
  },
  {
    team1: "Portugal",
    team2: "Belgium",
    score: "2 - 3",
    flag1: "🇵🇹",
    flag2: "🇧🇪",
    date: "18 December 2022",
    details: {
      stadium: "Lusail Iconic Stadium",
      referee: "Michael Oliver",
      goals: {
        Argentina: ["23' Lautaro Martínez (Á. Di María)"],
        Italy: [
          "45+1' Ciro Immobile (assist: L. Insigne)",
          "78' Federico Chiesa (assist: M. Verratti)",
        ],
      },
      substitutions: {
        Argentina: [
          "60' Paulo Dybala ↔ Á. Di María",
          "72' Leandro Paredes ↔ R. De Paul",
        ],
        Italy: [
          "65' Domenico Berardi ↔ L. Insigne",
          "82' Jorginho ↔ M. Verratti",
        ],
      },
    },
  },
  {
    team1: "Ghana",
    team2: "Brazil",
    score: "1 - 3",
    flag1: "🇬🇭",
    flag2: "🇧🇷",
    date: "17 December 2022",
    details: {
      stadium: "Lusail Iconic Stadium",
      referee: "Michael Oliver",
      goals: {
        Argentina: ["23' Lautaro Martínez (Á. Di María)"],
        Italy: [
          "45+1' Ciro Immobile (assist: L. Insigne)",
          "78' Federico Chiesa (assist: M. Verratti)",
        ],
      },
      substitutions: {
        Argentina: [
          "60' Paulo Dybala ↔ Á. Di María",
          "72' Leandro Paredes ↔ R. De Paul",
        ],
        Italy: [
          "65' Domenico Berardi ↔ L. Insigne",
          "82' Jorginho ↔ M. Verratti",
        ],
      },
    },
  },
  {
    team1: "Uruguay",
    team2: "Poland",
    score: "2 - 2",
    flag1: "🇺🇾",
    flag2: "🇵🇱",
    date: "17 December 2022",
    details: {
      stadium: "Lusail Iconic Stadium",
      referee: "Michael Oliver",
      goals: {
        Argentina: ["23' Lautaro Martínez (Á. Di María)"],
        Italy: [
          "45+1' Ciro Immobile (assist: L. Insigne)",
          "78' Federico Chiesa (assist: M. Verratti)",
        ],
      },
      substitutions: {
        Argentina: [
          "60' Paulo Dybala ↔ Á. Di María",
          "72' Leandro Paredes ↔ R. De Paul",
        ],
        Italy: [
          "65' Domenico Berardi ↔ L. Insigne",
          "82' Jorginho ↔ M. Verratti",
        ],
      },
    },
  },
  {
    team1: "Spanisht",
    team2: "Czech",
    score: "3 - 3",
    flag1: "🇪🇸",
    flag2: "🇨🇿",
    date: "16 December 2022",
    details: {
      stadium: "Lusail Iconic Stadium",
      referee: "Michael Oliver",
      goals: {
        Argentina: ["23' Lautaro Martínez (Á. Di María)"],
        Italy: [
          "45+1' Ciro Immobile (assist: L. Insigne)",
          "78' Federico Chiesa (assist: M. Verratti)",
        ],
      },
      substitutions: {
        Argentina: [
          "60' Paulo Dybala ↔ Á. Di María",
          "72' Leandro Paredes ↔ R. De Paul",
        ],
        Italy: [
          "65' Domenico Berardi ↔ L. Insigne",
          "82' Jorginho ↔ M. Verratti",
        ],
      },
    },
  },
];

export function LatestMatches() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mt-3 px-4">
        ⚽ Football Match
      </h3>

      <div className="p-4 space-y-4">
        <div className="relative border-b border-gray-200 dark:border-gray-700">
          <span className="relative z-10 text-sm font-medium text-[#100F0F] pb-2 inline-block">
            Latest Match
          </span>
          <div className="absolute bottom-0 left-0 h-[1px] w-full">
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-purple-600"
                style={{ width: "85px" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-w-[300px]">
          <Table className="[&>*]:divide-y-0">
            <TableBody>
              {matches.map((match, index) => (
                <React.Fragment key={index}>
                  <TableRow key={index} className="border-0">
                    <TableCell className="flex items-center gap-2 font-medium">
                      <span className="text-xl bg-[#A4A4A4] rounded-full py-1 px-3">
                        {match.flag1}
                      </span>
                      {match.team1}
                    </TableCell>

                    <TableCell className="text-center font-bold">
                      <Badge
                        variant="destructive"
                        className="bg-[#5742A9]/10 text-[#5742A9]"
                      >
                        {match.score}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex items-center gap-2 font-medium ml-5">
                      {match.team1}
                      <span className="text-xl bg-[#A4A4A4] rounded-full py-1 px-3">
                        {match.flag1}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="destructive"
                        className="bg-[#FA0E0E]/10 text-[#FA0E0E]"
                      >
                        Full - Time
                      </Badge>
                    </TableCell>

                    <TableCell className="text-[#A4A4A4]">
                      {match.date}
                    </TableCell>

                    <TableCell
                      className="cursor-pointer text-[#A4A4A4]"
                      onClick={() => toggleDetails(index)}
                    >
                      <Info className="w-4 h-4" />
                    </TableCell>
                  </TableRow>

                  {openIndex === index && match.details && (
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableCell colSpan={6} className="p-4 text-sm space-y-3">
                        <div className="font-bold text-xs text-[#100F0F]">
                          Match Details
                        </div>

                        <div className="flex flex-row justify-between items-start">
                          <div className="flex flex-col gap-3">
                            <div className="text-[#8F0606] font-semibold">
                              🏟 Stadium:{" "}
                              <span className="text-[#757575]">
                                {match.details.stadium}
                              </span>
                            </div>
                            <div className="text-[#8F0606] font-semibold">
                              ⚽ Goals:
                            </div>
                            <div className="flex flex-col gap-5">
                              <div className="text-[#757575]">
                                <strong>{match.team1}:</strong>
                                <ul className="list-disc pl-5">
                                  {match.details.goals.Argentina.map((g, i) => (
                                    <li key={i}>{g}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-[#757575]">
                                <strong>{match.team2}:</strong>
                                <ul className="list-disc pl-5">
                                  {match.details.goals.Italy.map((g, i) => (
                                    <li key={i}>{g}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="text-[#8F0606] font-semibold">
                              🟨 Referee:{" "}
                              <span className="text-[#757575]">
                                {match.details.referee}
                              </span>
                            </div>
                            <div className="flex flex-col gap-5">
                              <div className="text-[#757575]">
                                <strong className="text-[#8F0606] font-semibold">
                                  Substitutions ({match.team1}):
                                </strong>
                                <ul className="list-disc pl-5">
                                  {match.details.substitutions.Argentina.map(
                                    (s, i) => (
                                      <li key={i}>{s}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                              <div className="text-[#757575]">
                                <strong className="text-[#8F0606] font-semibold">
                                  Substitutions ({match.team2}):
                                </strong>
                                <ul className="list-disc pl-5">
                                  {match.details.substitutions.Italy.map(
                                    (s, i) => (
                                      <li key={i}>{s}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
