import { Tag, TagLabel } from "@chakra-ui/react";
import React from "react";

function DifficultyTag({ difficulty }) {
  let colorScheme;
  switch (difficulty.toLowerCase()) {
    case "easy":
      colorScheme = "green";
      break;
    case "medium":
      colorScheme = "yellow";
      break;
    case "hard":
      colorScheme = "red";
      break;
    default:
      colorScheme = "gray";
  }

  const capitalizedDifficulty =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <Tag colorScheme={colorScheme} size={"lg"}>
      <TagLabel>{capitalizedDifficulty}</TagLabel>
    </Tag>
  );
}

export default DifficultyTag;
