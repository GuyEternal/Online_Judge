import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import {
  Box,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Submissions() {
  const { usernameURL } = useParams(null);
  const [username, setUsername] = useState(null);
  const [fishy, setFishy] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const changeLoggedInParentState = (newState) => {
    setIsLoggedIn(newState);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const DD = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
    const YY = String(date.getFullYear()).slice(-2);
    const HH = String(date.getHours()).padStart(2, "0");
    const MM = String(date.getMinutes()).padStart(2, "0");
    const SSSS = String(date.getSeconds()).padStart(2, "0");
    return `${DD}/${mm}/${YY} ${HH}:${MM}:${SSSS}`;
  }

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:3001/api/submissions/user/${username}`)
        .then((response) => {
          setSubmissions(response.data.subs);
        });
    } else {
      setFishy(false);
      // Fetch and display all submissions...
      axios.get("http://localhost:3001/api/submissions").then((response) => {
        setSubmissions(response.data.subs);
      });
    }
  }, [username]);

  // Render the submissions...
  return (
    <div>
      <Navbar setIsLoggedInForParent={changeLoggedInParentState} />
      <Box>
        <Stack>
          <Text
            fontSize={"x-large"}
            bgColor={useColorModeValue("gray.200", "gray.900")}
            color={useColorModeValue("gray.900", "gray.200")}
            fontFamily={"Noto Sans"}
          >
            {username === null ? "All Submissions" : "My Submissions"}
          </Text>
        </Stack>
      </Box>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Time</Th>
              <Th>Problem</Th>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Runtime</Th>
              <Th>Memory</Th>
              <Th>Language</Th>
            </Tr>
          </Thead>
          <Tbody>
            {submissions.map((sub) => {
              return (
                <Tr key={sub._id}>
                  <Td>{formatDate(sub.createdAt)}</Td>
                  <Td>{sub.problemName}</Td>
                  <Td>{sub.username}</Td>
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
    </div>
  );
}
