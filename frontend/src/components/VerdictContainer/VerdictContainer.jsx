import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

const subs = [
  {
    language: "cpp",
    verdict: "Accepted",
    time: "250",
    memory: "1.6",
    createdAt: new Date().toISOString(),
  },
  {
    language: "java",
    verdict: "WA",
    time: "300",
    memory: "2.1",
    createdAt: new Date().toISOString(),
  },
  {
    language: "python",
    verdict: "TLE",
    time: "500",
    memory: "1.2",
    createdAt: new Date().toISOString(),
  },
  {
    language: "javascript",
    verdict: "RUNTIME ERROR",
    time: "350",
    memory: "1.8",
    createdAt: new Date().toISOString(),
  },
  {
    language: "c",
    verdict: "COMPILER ERROR",
    time: "400",
    memory: "1.5",
    createdAt: new Date().toISOString(),
  },
];

function VerdictContainer() {
  // Get current date and time
  const now = new Date();

  // Format date as DD/MM/YY

  // Combine date and time
  const dateTime = (time) => {
    // do some transformation from time to a formatted object of data and time
    const now = new Date(time);

    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    // Format time as HH:MM:SS
    const timeObj = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${date} ${timeObj}`;
  };
  return (
    <Box>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Time Submitted</Th>
              <Th>Status</Th>
              <Th>Runtime</Th>
              <Th>Memory</Th>
              <Th>Language</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subs.map((sub) => {
              return (
                <Tr>
                  <Td>{dateTime(sub.createdAt)}</Td>
                  <Td
                    fontSize="sm"
                    fontFamily="verdana, sans-serif"
                    style={{
                      color: sub.verdict === "Accepted" ? "green" : "red",
                      fontWeight: sub.verdict === "Accepted" && "bold",
                    }}
                  >
                    {sub.verdict}
                  </Td>
                  <Td>{sub.time + " ms"}</Td>
                  <Td>{sub.memory + " MB"}</Td>
                  <Td>{sub.language}</Td>
                </Tr>
              );
            })}
          </Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>Time Submitted</Th>
              <Th>Status</Th>
              <Th>Runtime</Th>
              <Th>Memory</Th>
              <Th>Language</Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default VerdictContainer;
