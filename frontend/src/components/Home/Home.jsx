import React from 'react'
import { Box, Button, Heading, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import "./home.css"
import { Link } from 'react-router-dom';
import vg from '../../assests/images/bg.png'
// import vg from '../../assests/images/htv.jpeg'

const Home = () => {
  return (
    <section className='home'>
        <div className='container'>
            <Stack 
            direction={["column","row"]}
            height="100%"
            justifyContent={["center","flex-end"]}
            alignItems="center"
            spacing={["16","56"]}
            >
                <VStack width={"full"} alignItems={['center','flex-end']} spacing='8'>
                    <Heading children="HT Visions" size={'2xl'}/>
                    <Text fontSize={'xl'} textAlign={['center','left']} children="Transform your business with cutting-edge IT Solutions from HT Visions" />
                    <Link to='/login'>
                    <Button size={'lg'} colorScheme={"yellow"}>Explore Now</Button></Link>
                </VStack>
                <Image className='vector-graphics' boxSize={'md'} src={vg} objectFit="contain"/>
            </Stack>
        </div>
    </section>
  )
}

export default Home