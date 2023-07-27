//@ts-nocheck
import { Text, Box, Container, VStack, Button, Center, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Flex, SliderFilledTrack, SliderThumb, SliderTrack, Image } from "@chakra-ui/react"
import React, { useCallback, useRef, useState } from 'react';
import { AutoComplete, Slider } from "@geist-ui/core";

export const getStaticProps = async () => {
  const fetchStocks = await fetch(`${process.env.BRAPI_URL}/api/available`)
  const response = await fetchStocks.json()
  const stocks = response.stocks
  console.log(process.env.BRAPI_URL)
  return { props: { stocks } }
}

function searchArray(stocks: any) {
  var array = stocks.map((str: string) => ({label: str, value: str.toLowerCase()}))
  return array
}

export default function Home(props: any) {
  const SearchInput = () => {
    const allOptions = searchArray(props.stocks)
    const [options, setOptions] = useState()
    const [searching, setSearching] = useState(false)
    const timer = useRef()
    // triggered every time input
    const searchHandler = (currentValue: string) => {
      if (!currentValue) return setOptions([])
      setSearching(true)
      const relatedOptions = allOptions.filter((item: { value: string | string[]; }) => item.value.includes(currentValue))
      // this is mock async request
      // you can get data in any way
      timer.current && clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setOptions(relatedOptions)
        setSearching(false)
        clearTimeout(timer.current)
      }, 1000)
    }
    return (
      <AutoComplete
        id='searchbox'
        searching={searching}
        options={options}
        placeholder="Digite o ticker da ação"
        onSearch={searchHandler}
        color="white"
         />
    )
  }
  const [value, setValue] = useState()
  const handler = val => {
    setValue(val)
  }

  const fetchStocksData = () => {
    if (typeof window !== "undefined") {
      const ticker = document.getElementById('searchbox').value
      const periodo = value
      fetch(`/api/acoes/${ticker}?periodo=${periodo}`)
      .then(response => response.json())
      .then(result => {
        document.querySelector('#dividendosEsseAno').textContent = `R$ ${result[ticker].dividendos.dividendosEsseAno}`
        document.querySelector('#totalPeriodo').textContent = `R$ ${result[ticker].dividendos.totalPeriodo}`
        document.querySelector('#mediaPeriodo').textContent = `R$ ${result[ticker].dividendos.mediaPeriodo}`
      })
      fetch(`https://brapi.dev/api/quote/list?sortBy=close&sortOrder=desc&limit=10&search=${ticker}`)
      .then(response => response.json())
      .then(result => {
        document.getElementById("logo").src=result.stocks[0].logo
      })
      document.getElementById('responsebox').style.display = "block";
    }
  }

  return (
    <>
      <Center bg={'white'} height={'100vh'}>
        <VStack>
        <a href="/"><Text textColor={"black"} fontWeight={'extrabold'} fontSize={"5xl"}>Calculo de dividendos médio por período</Text></a>
          <Box textColor={'black'}>
            <HStack>
              <Text textColor={"black"} fontWeight={'extrabold'} fontSize={'xl'}>PERÍODO (anos)</Text>
              <Slider id='slider' value={value} onChange={handler} ml={1} width={'250px'} initialValue={1} max={10} />
            </HStack>
          </Box>
          <Box textColor={'black'}>
            <HStack>
              <Text textColor={"black"} fontWeight={'extrabold'} fontSize={'xl'}>TICKER</Text>
              <SearchInput></SearchInput>
            </HStack>
          </Box>
          <Button onClick={fetchStocksData} mt={5} width={"350px"} colorScheme="blue">Calcular</Button>
          <Box display={'flex'} id="responsebox" boxShadow='dark-lg' display="none" mt={'50px'} borderRadius={'5px'} bg={'white'} maxW={'800px'} maxH={'450px'}>
            <Image mt={4} ml={4} boxShadow='dark-lg' id='logo'></Image>
            <Text ml={4} mt={2} textColor={'black'} fontWeight={'extrabold'} fontSize={'xl'}>DIVIDENDOS DESSE ANO: <Text as="span" id='dividendosEsseAno' ml={'42px'} mr={5} textColor={'blue.500'} fontSize={'xl'} fontWeight={'extrabold'}></Text></Text>
            <Text ml={4} mt={2} textColor={'black'} fontWeight={'extrabold'} fontSize={'xl'}>TOTAL DURANTE PERÍODO: <Text as="span" id='totalPeriodo' ml={'20px'} mr={5} textColor={'blue.500'} fontSize={'xl'} fontWeight={'extrabold'}></Text></Text>
            <Text ml={4} mt={2} textColor={'black'} fontWeight={'extrabold'} fontSize={'xl'}>MÉDIA DO PERÍODO: <Text as="span" id='mediaPeriodo' ml={'85px'} mr={5} textColor={'blue.500'} fontSize={'xl'} fontWeight={'extrabold'}></Text></Text>
          </Box>
        </VStack>
      </Center>
    </>
  )
}