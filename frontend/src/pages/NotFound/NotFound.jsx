import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, red.500, red.700)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        colorScheme="red"
        bgGradient="linear(to-r, red.500, red.600, red.700)"
        color="white"
        variant="solid"
        as={Link}
        to="/"
      >
        Go to Home
      </Button>
    </Box>
  );
}
