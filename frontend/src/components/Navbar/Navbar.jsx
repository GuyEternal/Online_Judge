import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Modal,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import ColorModeSwitcher from "../ColorModeSwitcher/ColorModeSwitcher.jsx";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({ loggedIn, username_prop }) {
  const [username, setusername] = useState(username_prop);
  const { isOpen, onToggle } = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const navigate = useNavigate();

  const handleLogout = () => {
    // setIsLoggedIn(!isLoggedIn);
    axios
      .get("http://localhost:3001/api/auth/logout")
      .then((response) => {
        console.log("Logout!!!!");
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((error) => {
        alert(error.message); // alert the actual error message
      });
  };

  // const dummyLogin = () => {
  //   setIsLoggedIn(!isLoggedIn);
  // };

  useEffect(() => {
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
  }, [loggedIn, username_prop]); // Removed isLoggedIn from the dependency array
  return (
    <Box className={styles["big-box"]} w={"100%"}>
      <Flex
        bg={useColorModeValue("blue.200", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        alignContent={"center"}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          alignContent="center"
          alignItems="center"
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            as={"a"}
            href={"http://localhost:5173"}
            className={styles.logo}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            color={useColorModeValue("gray.800", "white")}
            cursor={"pointer"}
          >
            AlgoPractice
          </Text>

          <Flex
            display={{ base: "none", md: "flex" }}
            alignContent="center"
            alignItems="center"
            ml={10}
          >
            {isLoggedIn ? (
              <DesktopNav navItems={NAV_ITEMS_LOGGED_OUT} />
            ) : (
              <DesktopNav navItems={NAV_ITEMS_LOGGED_OUT} />
            )}
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          alignItems={"center"}
          direction={"row"}
          spacing={6}
        >
          <ColorModeSwitcher />
          {!isLoggedIn ? (
            <Flex
              padding={2}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Button
                maxW={"400rem"}
                maxH={"20rem"}
                as={"a"}
                padding={"0.8rem"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                // onClick={dummyLogin}
                href={"http://localhost:5173/auth/login"}
              >
                Sign In
              </Button>
              <Button
                maxW={"400rem"}
                maxH={"20rem"}
                as={"a"}
                padding={"0.8rem"}
                fontSize={"sm"}
                fontWeight={600}
                color={"black"}
                bg={"cyan.400"}
                href={"http://localhost:5173/auth/register"}
                _hover={{
                  bg: "cyan.300",
                  transition: "0.1s",
                }}
              >
                Sign Up
              </Button>
            </Flex>
          ) : (
            <Flex
              padding={2}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Button
                maxW={"400rem"}
                maxH={"20rem"}
                as={"a"}
                padding={"0.8rem"}
                display={{ base: "none", md: "inline-flex" }}
                h={"100%"}
                fontSize={"sm"}
                fontWeight={600}
                color={"black"}
                bg={"cyan.400"}
                onClick={handleLogout}
              >
                Log Out
              </Button>
              <Avatar
                maxW={"400rem"}
                maxH={"20rem"}
                name={username == null ? "U" : username}
                size="md"
                marginLeft={"0.4rem"}
                bg={"blue.600"}
                // onClick={}
              ></Avatar>
            </Flex>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "blue.900");
  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href}
                fontSize={"sm"}
                fontWeight={500}
                textAlign={"center"}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("cyan.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "cyan.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"cyan.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Problems",
    children: [
      {
        label: "Problem List",
        subLabel: "Find a list of all problems",
        href: "/problemset",
      },
      {
        label: "Submit a new problem",
        subLabel: "If you are a problem setter",
        href: "/404",
      },
    ],
  },
  {
    label: "Contest",
    children: [
      {
        label: "Previous Contests",
        subLabel: "See how you've performed",
        href: "/broken",
      },
      {
        label: "Upcoming Contests",
        subLabel: "Register for new contests!",
        href: "/broken",
      },
    ],
  },
  {
    label: "Submissions",
    href: "#",
    children: [
      {
        label: "My Submissions",
        subLabel: "",
        href: `/submissions`,
      },
      {
        label: "All Submission",
        subLabel: "",
        href: "/submissions",
      },
    ],
  },
];
const NAV_ITEMS_LOGGED_OUT = [
  {
    label: "Problems",
    children: [
      {
        label: "Problem List",
        subLabel: "Find a list of all problems",
        href: "/problemset",
      },
      {
        label: "Submit a new problem",
        subLabel: "If you are a problem setter",
        href: "/problem/add",
      },
    ],
  },
  {
    label: "Contest",
    children: [
      {
        label: "Previous Contests",
        subLabel: "See how you've performed",
        href: "/broken",
      },
      {
        label: "Upcoming Contests",
        subLabel: "Register for new contests!",
        href: "/broken",
      },
    ],
  },
  {
    label: "Submissions",
    href: "#",
    children: [
      {
        label: "All Submission",
        subLabel: "",
        href: "/submissions",
      },
    ],
  },
];
