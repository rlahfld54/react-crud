// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");
  const { colorMode } = useColorMode();

  // 카카오 로그인 토큰 받아오는 것 까지 완성함. 이제 관리자,사용자 전용 라우터 만들어야함
  const [kakao, setkakao] = useState("");
  const [access_token, setaccess_token] = useState("");
  const [userInfo, setuserInfo] = useState({});

  useEffect(() => {
    console.log("카카오 로그인 인가코드 받아온 상태");
    console.log("액시오스 ㄱㄱ");
    let code = new URL(document.location.toString()).searchParams.get("code"); // 이상한코드가한가득
    // console.log(code);
    setkakao(code);
    const kakaoHeader = {
      Authorization: "c97305d3a059648fd88be9a28a6bca68",
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    var result = "";
    const getKakaoToken = async (code) => {
      console.log("loginWithKakao");
      try {
        const data = {
          grant_type: "authorization_code",
          client_id: "c97305d3a059648fd88be9a28a6bca68", // JavaScript 키
          redirect_uri: "http://localhost:3000/admin/dashboard",
          code: code,
          client_secret: "ueSwlQ7UUOhKRVv62bIWWGnc4Uhj7qfg",
        };
        // console.log(data);
        const queryString = Object.keys(data)
          .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
          .join("&");
        // console.log(queryString);
        // console.log(
        //   ("https://kauth.kakao.com/oauth/token",
        //   queryString,
        //   { headers: kakaoHeader })
        // );
        result = await axios.post(
          `https://kauth.kakao.com/oauth/token`,
          queryString,
          { headers: kakaoHeader }
        );
        // console.log("카카오 토큰", queryString);
        console.log(result);
        // 토큰 할당
        setaccess_token(result.data.access_token);
        // Kakao.Auth.setAccessToken(result.data.access_token);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    getKakaoToken(code);
  }, [kakao]);

  const kakaoLogout = () => {
    const kakaoHeader = {
      Authorization: `Bearer ${access_token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    let ok = {
      result: "success",
    };
    axios
      .post("https://kapi.kakao.com/v1/user/logout", ok, {
        headers: kakaoHeader,
      })
      .then((response) => {
        // 로그아웃 요청 성공 시, 응답 코드와 로그아웃된 사용자의 회원번호를 받습니다.
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserinfo = () => {
    const kakaoHeader = {
      Authorization: `Bearer ${access_token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    let ok = {
      result: "success",
    };
    axios
      .post("https://kapi.kakao.com/v2/user/me", ok, {
        headers: kakaoHeader,
      })
      .then((response) => {
        // 로그아웃 요청 성공 시, 응답 코드와 로그아웃된 사용자의 회원번호를 받습니다.
        console.log(response);
        setuserInfo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid spacing="24px" mb="20px">
        <Card>
          <Box>
            <Text fontSize="3xl">황주은님 안녕하세요~</Text>
            <button onClick={kakaoLogout}>카카오톡 로그아웃</button>
            <button onClick={getUserinfo}>사용자 정보 받기</button>
          </Box>
        </Card>
      </SimpleGrid>
    </Flex>
  );
}
