import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
} from "@chakra-ui/react";

import Navbar from "../../components/Navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState();

  useEffect(() => {
    // checkAuth
    axios
      .get("http://localhost:3001/api/auth/checkAuth")
      .then((response) => {
        setIsLoggedIn(response.data.success);
        setusername(response.data.username);
        0;
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
      });
  });
  return (
    <Stack _light={{ bgColor: "orange.200" }} h={"100vh"}>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <Container maxW={"4xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 2, md: 10 }}
          paddingY={{ base: 20 }}
        >
          <Heading
            padding={{ base: 3 }}
            fontWeight={800}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Practice your coding skills <br />
            <Text as={"span"} color={"green.400"}>
              with AlgoPractice
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Practice from a set of a wide variety of problems ranging from
            simple array problems to difficult mind bending problems. Use the
            leaderboard for see where you are placed among the top performers!
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              as={"a"}
              href="auth/register"
              px={6}
              _hover={{
                bg: "green.500",
              }}
            >
              Get Started
            </Button>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}

export default Home;
