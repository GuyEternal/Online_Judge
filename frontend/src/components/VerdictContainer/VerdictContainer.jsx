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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

function VerdictContainer({ username_prop, trigger_prop, problemID_prop }) {
  // Get current date and time
  const now = new Date();
  const [username, setusername] = useState(username_prop);
  const [dummyState, setDummyState] = useState(false);
  const [subs, setSubs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    onOpen();
  };
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

  useEffect(() => {
    console.log("trigger:" + trigger_prop);
    setDummyState(!dummyState);
    if (username) {
      axios
        .get(
          `http://localhost:3001/api/submissions/user/${username}/problem/${problemID_prop}`
        )
        .then((response) => {
          setSubs(response.data.subs);
        });
    }
  }, [trigger_prop]);
  const [currSubmission, setCurrSubmission] = useState();

  return (
    <Box>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size={"lg"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Submission Code</ModalHeader>
          <ModalBody>
            <Text whiteSpace={"pre-wrap"}>{selectedSubmission?.code}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
            {subs.map((sub, id) => {
              return (
                <Tr key={id++}>
                  <Td>{dateTime(sub.createdAt)}</Td>
                  <Td
                    fontSize="sm"
                    fontFamily="verdana, sans-serif"
                    style={{
                      cursor: "pointer",
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
    </Box>
  );
}

export default VerdictContainer;
