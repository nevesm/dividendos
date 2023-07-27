export default function handler(req, res) {
  try {
    const query = req.query
    const { ticker, periodo } = query
    if (!periodo) {
      res.status(400).json({
        "message": "A api deve ser chamada com o ticker e período, refaça a chamada e tente novamente: /api/acoes/{ticker}?periodo={periodo}",
        "error": "Bad Request"
      })
    }
    else {
      const userAgentHeader = process.env.USER_AGENT_HEADER || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

      const myHeaders = new Headers();
      myHeaders.append("user-agent", userAgentHeader);
  
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
  
      fetch(`${process.env.STATUS_INVEST_URL}/acao/companytickerprovents?ticker=${ticker}&chartProventsType=2`, requestOptions)
      .then(response => response.json())
      .then(result => {
        var earningsThisYear = result.earningsThisYear
        var sum = 0
        for(var i =0;i<result.assetEarningsYearlyModels.slice(1).slice(-periodo).length;i++){
            sum+=result.assetEarningsYearlyModels.slice(1).slice(-periodo)[i].value;
        }
        const totalPeriodo = sum
        const mediaPeriodo = sum/periodo
        res.status(200).json({
          [ticker]: {
            "dividendos": {
              "dividendosEsseAno": earningsThisYear,
              "totalPeriodo": totalPeriodo,
              "mediaPeriodo": mediaPeriodo,
              "historico": result.assetEarningsYearlyModels
            }
          }
        })})
    }
  } catch (error) {
    res.status(500).json({
      "message": "Não foi possivel processar!",
      "error": error
    })
  }
}