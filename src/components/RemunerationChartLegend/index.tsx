import { useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import Payments from '@mui/icons-material/Payments';
import AlertModal from '../AlertModal';
import { formatCurrencyValue } from '../../functions/format';

const index = ({
  agency,
  data,
  year,
  graphType,
  setGraphType,
  baseRemunerationDataTypes,
  otherRemunerationsDataTypes,
  discountsDataTypes,
  hidingWage,
  setHidingWage,
  hidingBenefits,
  setHidingBenefits,
  hidingNoData,
  setHidingNoData,
  monthsWithoutData,
  yearsWithoutData,
  warningMessage,
  annual = false,
}: {
  agency: Agency;
  data: v2MonthTotals[] | AnnualSummaryData[];
  year: number;
  graphType: string;
  setGraphType: React.Dispatch<React.SetStateAction<string>>;
  baseRemunerationDataTypes: string;
  otherRemunerationsDataTypes: string;
  discountsDataTypes: string;
  hidingWage: boolean;
  setHidingWage: React.Dispatch<React.SetStateAction<boolean>>;
  hidingBenefits: boolean;
  setHidingBenefits: React.Dispatch<React.SetStateAction<boolean>>;
  hidingNoData: boolean;
  setHidingNoData: React.Dispatch<React.SetStateAction<boolean>>;
  monthsWithoutData: ({
    // eslint-disable-next-line no-shadow
    data,
    // eslint-disable-next-line no-shadow
    year,
  }: {
    data: v2MonthTotals[] | AnnualSummaryData[];
    year?: number;
  }) => any;
  yearsWithoutData?: number[];
  warningMessage?: string;
  annual?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        display="flex"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        mb={4}
      >
        <Box maxWidth={{ xs: 320, sm: 720 }} mb={1}>
          {annual === false &&
            agency != null &&
            data.length < 12 &&
            data.length > 0 &&
            monthsWithoutData({ data, year }).length > 0 && (
              <Box mt={2} display="flex" justifyContent="center">
                <AlertModal
                  agencyData={agency}
                  openParam={open}
                  handleClose={handleClose}
                  handleOpen={handleOpen}
                >
                  Este órgão não publicou dados de{' '}
                  {`${monthsWithoutData({ data, year }).length} ${
                    monthsWithoutData({ data, year }).length > 1
                      ? 'meses.'
                      : 'mês.'
                  }`}
                </AlertModal>
              </Box>
            )}
          {annual &&
            (yearsWithoutData.length > 0 || monthsWithoutData({ data }) > 0) &&
            warningMessage.length > 0 && (
              <Box mt={2} display="flex" justifyContent="center">
                <AlertModal
                  agencyData={agency}
                  openParam={open}
                  handleClose={handleClose}
                  handleOpen={handleOpen}
                >
                  {warningMessage}
                </AlertModal>
              </Box>
            )}
          {agency && (
            <Tabs
              value={graphType}
              onChange={(event: React.SyntheticEvent, newValue: any) =>
                setGraphType(newValue)
              }
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="Opções de gráfico"
              sx={{ mt: 2 }}
            >
              <Tab value="media-por-membro" label="Média por membro" />
              {annual && <Tab value="media-mensal" label="Média mensal" />}
              <Tab value="total" label="Total de remunerações" />
            </Tabs>
          )}
        </Box>
        <Typography variant="h5" textAlign="center" mt={2}>
          {graphType === 'media-por-membro' &&
            `Em média, cada membro deste órgão recebeu: `}
          {graphType === 'media-mensal' &&
            `Em média, este órgão gastou mensalmente: `}
          {graphType === 'total' && `Total de gastos deste órgão: `}
          {(() => {
            // this function is used to sum the data from all money arrays and generate the last remuneration value
            let total = 0;
            const monthlyTotals = data.map(
              d =>
                d[baseRemunerationDataTypes] + d[otherRemunerationsDataTypes],
            );
            monthlyTotals.forEach(w => {
              total += w;
            });

            if (graphType === 'total') {
              return formatCurrencyValue(total);
            }

            return formatCurrencyValue(total / data.length);
          })()}
          <Tooltip
            placement="top"
            title={
              <Typography fontSize="0.8rem">
                <p>
                  <b>Membros:</b> Participantes ativos do órgao, incluindo os
                  servidores públicos, os militares e os membros do Poder
                  Judiciário.
                </p>
                <p>
                  <b>Servidor:</b> Funcionário público que exerce cargo ou
                  função pública, com vínculo empregatício, e que recebe
                  remuneração fixa ou variável.
                </p>
                <p>
                  <b>Remunerações:</b> Valor final da soma entre salário e
                  benefícios, retirando os descontos.
                </p>
                <p>
                  <b>Salário:</b> Valor recebido de acordo com a prestação de
                  serviços, em decorrência do contrato de trabalho.
                </p>
                <p>
                  <b>Benefícios:</b> Qualquer remuneração recebida por um
                  funcionário que não seja proveniente de salário. Exemplos de
                  benefícios são: diárias, gratificações, remuneração por função
                  de confiança, benefícios pessoais ou eventuais, auxílios
                  alimentação, saúde, escolar...
                </p>
                <p>
                  <b>Sem dados:</b> Quando um órgão não disponibiliza os dados
                  de um determinado mês
                </p>
              </Typography>
            }
          >
            <IconButton aria-label="Botão de informações">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      </Box>
      <Grid
        container
        maxWidth={850}
        margin="auto"
        justifyContent="space-between"
        p={1}
      >
        {agency && (
          <Grid xs={5} md={3} item textAlign="center">
            <IconButton
              sx={{ backgroundColor: '#57659d' }}
              onClick={e => {
                if (hidingWage) {
                  e.currentTarget.classList.remove('active');
                  setHidingWage(false);
                } else {
                  e.currentTarget.classList.add('active');
                  setHidingWage(true);
                }
              }}
            >
              <Payments />
            </IconButton>
            <Typography pt={1}>
              Remunerações:
              <br />
              {(() => {
                let total = 0;
                const yearlyTotals = data.map(
                  d =>
                    d[baseRemunerationDataTypes] +
                    d[otherRemunerationsDataTypes] -
                    d[discountsDataTypes],
                );

                yearlyTotals.forEach(w => {
                  total += w;
                });

                return formatCurrencyValue(total);
              })()}
            </Typography>
          </Grid>
        )}
        <Grid xs={5} md={3} item textAlign="center">
          <IconButton
            sx={{ backgroundColor: '#2fbb95' }}
            onClick={e => {
              if (hidingWage) {
                e.currentTarget.classList.remove('active');
                setHidingWage(false);
              } else {
                e.currentTarget.classList.add('active');
                setHidingWage(true);
              }
            }}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
          <Typography pt={1}>
            Salário:{' '}
            {(() => {
              let total = 0;
              const yearlyTotals = data.map(d => d[baseRemunerationDataTypes]);

              yearlyTotals.forEach(w => {
                total += w;
              });

              return formatCurrencyValue(total);
            })()}
          </Typography>
        </Grid>
        <Grid xs={5} md={3} item textAlign="center">
          <IconButton
            sx={{ backgroundColor: '#96bb2f' }}
            onClick={e => {
              if (hidingBenefits) {
                e.currentTarget.classList.remove('active');
                setHidingBenefits(false);
              } else {
                e.currentTarget.classList.add('active');
                setHidingBenefits(true);
              }
            }}
          >
            <CardGiftcardIcon />
          </IconButton>
          <Typography pt={1}>
            Benefícios:{' '}
            {(() => {
              let total = 0;
              const yearlyTotals = data.map(
                d => d[otherRemunerationsDataTypes],
              );

              yearlyTotals.forEach(w => {
                total += w;
              });

              return formatCurrencyValue(total);
            })()}
          </Typography>
        </Grid>
        <Grid xs={5} md={3} item textAlign="center">
          <IconButton
            sx={{ backgroundColor: '#3E5363' }}
            onClick={e => {
              if (hidingNoData) {
                e.currentTarget.classList.remove('active');
                setHidingNoData(false);
              } else {
                e.currentTarget.classList.add('active');
                setHidingNoData(true);
              }
            }}
          >
            <CropSquareIcon />
          </IconButton>
          <Typography pt={1}>Sem dados</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default index;