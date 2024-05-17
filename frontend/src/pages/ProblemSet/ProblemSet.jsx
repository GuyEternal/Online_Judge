import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

function ProblemSet() {
  // const [problems, setProblems] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3001/api/problem")
  //     .then((response) => {
  //       setProblems(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // }, []);
  const problems = [
    {
      _id: "6647befc093c986e88e09fa6",
      name: "Two Sum",
      statement:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n" +
        "\n" +
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n" +
        "\n" +
        "You can return the answer in any order.\n" +
        "\n" +
        "Example 1:\n" +
        "\n" +
        "Input: nums = [2, 7, 11, 15], target = 9\n" +
        "Output: [0, 1]\n" +
        "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n" +
        "\n" +
        "Example 2:\n" +
        "\n" +
        "Input: nums = [3, 2, 4], target = 6\n" +
        "Output: [1, 2]\n" +
        "\n" +
        "Example 3:\n" +
        "\n" +
        "Input: nums = [3, 3], target = 6\n" +
        "Output: [0, 1]\n" +
        "\n" +
        "Constraints:\n" +
        "\n" +
        "2 <= nums.length <= 10^4\n" +
        "-10^9 <= nums[i] <= 10^9\n" +
        "-10^9 <= target <= 10^9\n" +
        "Only one valid answer exists.\n" +
        "\n" +
        "Follow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?",
      difficulty: "Medium",
      submissions: [],
      __v: 0,
    },
    {
      _id: "6647bf1a093c986e88e09fac",
      name: "3 Sum",
      statement:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n" +
        "\n" +
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n" +
        "\n" +
        "You can return the answer in any order.\n" +
        "\n" +
        "Example 1:\n" +
        "\n" +
        "Input: nums = [2, 7, 11, 15], target = 9\n" +
        "Output: [0, 1]\n" +
        "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n" +
        "\n" +
        "Example 2:\n" +
        "\n" +
        "Input: nums = [3, 2, 4], target = 6\n" +
        "Output: [1, 2]\n" +
        "\n" +
        "Example 3:\n" +
        "\n" +
        "Input: nums = [3, 3], target = 6\n" +
        "Output: [0, 1]\n" +
        "\n" +
        "Constraints:\n" +
        "\n" +
        "2 <= nums.length <= 10^4\n" +
        "-10^9 <= nums[i] <= 10^9\n" +
        "-10^9 <= target <= 10^9\n" +
        "Only one valid answer exists.\n" +
        "\n" +
        "Follow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?",
      difficulty: "Hard",
      submissions: [],
      __v: 0,
    },
  ];

  return (
    <div>
      ProblemSet
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>PID: </Th>
              <Th>Problem Name</Th>
              <Th>Tags</Th>
              <Th isNumeric>Submitted By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {problems.map((problem) => (
              <Tr key={problem._id}>
                <Td>{problem._id}</Td>
                <Td>{problem.name}</Td>
                {/* <Td>{problem.tags}</Td> */}
                <Td isNumeric>Gaga gugu</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ProblemSet;
