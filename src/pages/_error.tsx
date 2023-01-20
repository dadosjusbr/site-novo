import { Typography, Box, Button } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Error() {
  return (
    <>
      <Head>
        <title>DadosJusBr</title>
        <meta property="og:image" content="/img/icon_dadosjus_background.png" />
        <meta property="og:title" content="DadosJusBr" />
        <meta
          property="og:description"
          content="DadosJusBr é uma plataforma que realiza a libertação continua de dados de remuneração de sistema de justiça brasileiro."
        />
      </Head>
      <Header />
      <Box
        sx={{
          display: 'flex',
          height: '90vh',
          textAlign: 'center',
        }}
      >
        <Div>
          <Image width={700} height={200} src="/img/PageNotFound.svg" alt="" />
          <Typography sx={{ my: 4 }} variant="h4">
            Página não encontrada
          </Typography>
          <Button sx={{ mb: 4, fontSize: 18 }} variant="outlined" href="/">
            Ir para a página inicial
          </Button>
        </Div>
      </Box>
      <Footer />
    </>
  );
}

const Div = styled.div`
  margin: auto;
  padding: 2;
`;

export default Error;