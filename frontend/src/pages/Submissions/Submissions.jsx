import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
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
  useDisclosure,
} from "@chakra-ui/react";

export default function Submissions() {
  // const { usernameURL } = useParams();
  const [username, setusername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    onOpen();
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
  // useEffect(() => {

  // }, []);
  useEffect(() => {
    console.log(username);
    axios
      .get("http://localhost:3001/api/auth/checkAuth")
      .then((response) => {
        setIsLoggedIn(response.data.success);
        setusername(response.data.username);

        // If the user is logged in, fetch their submissions
        if (response.data.success) {
          axios
            .get(`http://localhost:3001/api/submissions/user/${username}`)
            .then((response) => {
              console.log("Got the data for :" + username);
              setSubmissions(response.data.subs);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching user's submissions:", error);
            });
        } else {
          // If the user is not logged in, fetch all submissions
          axios
            .get(`http://localhost:3001/api/submissions`)
            .then((response) => {
              console.log("Got the data for ALLLL");
              setSubmissions(response.data.subs);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching ALL submissions:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
      });
  }, [username]);

  // Render the submissions...
  return (
    <div>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Submission Code</ModalHeader>
          <ModalBody>
            <Text
              bg={
                localStorage.getItem("chakra-ui-color-mode") === "light"
                  ? "gray.200"
                  : "gray.900"
              }
              userSelect={"none"}
              fontFamily={"Source Code Pro"}
              whiteSpace={"pre-wrap"}
            >
              {selectedSubmission?.code}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <Stack>
          <Text
            fontSize={"x-large"}
            bgColor={useColorModeValue("gray.200", "gray.900")}
            color={useColorModeValue("gray.900", "gray.200")}
            fontFamily={"Noto Sans"}
          >
            {isLoggedIn ? "My Submissions" : "All Submissions"}
          </Text>
        </Stack>
      </Box>
      {isLoading ? (
        <Spinner />
      ) : (
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
                      <Text
                        colorScheme="teal"
                        _hover={{
                          color: "teal.500",
                        }}
                        onClick={() => handleSubmissionClick(sub)}
                      >
                        {sub.verdict}
                      </Text>
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
      )}
    </div>
  );
}
