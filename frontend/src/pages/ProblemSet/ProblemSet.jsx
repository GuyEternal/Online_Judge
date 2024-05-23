import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Box,
  Link,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Cookies from "universal-cookie";
import Problem from "../Problem/Problem";

function ProblemSet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedPid, setSelectedPid] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/problem")
      .then((response) => {
        console.log(response.data.length);
        setProblems(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <Box>
        <Stack>
          <Text
            fontSize={"x-large"}
            bgColor={useColorModeValue("gray.200", "gray.900")}
            color={useColorModeValue("gray.900", "gray.200")}
            fontFamily={"Noto Sans"}
          >
            Problem Set
          </Text>
        </Stack>
      </Box>
      {selectedPid ? (
        <Problem pid={selectedPid} />
      ) : (
        <TableContainer bgColor={useColorModeValue("gray.200", "gray.900")}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th maxW={1}>PID: </Th>
                <Th>Problem Name</Th>
                <Th>Tags</Th>
                <Th isNumeric>Submitted By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {problems.map((problem, srNo = 0) => (
                <Tr key={problem._id}>
                  <Td>{srNo++}</Td>
                  <Td>
                    <Link onClick={() => setSelectedPid(problem._id)}>
                      {problem.name}
                    </Link>
                  </Td>
                  <Td>{problem.difficulty}</Td>
                  <Td isNumeric>45</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default ProblemSet;
