const getLineInfo = async () => {
    try {
        const response = await fetch(
          'http://telematics.oasa.gr/api/?act=webGetLines'
        )
        const responseJson = await response.json();
        console.log('got buses')
        return (responseJson)
      } catch (error) {
        console.log(error)
      }
}

const getRoutes = async (linecode) => {
  try {
    const response = await fetch(
      `http://telematics.oasa.gr/api/?act=webGetRoutes&p1=${linecode}`
    )
    if (response == null) {
      throw new Error('null response')
    }
    const responseJson = await response.json();
    console.log('got routes')
    return(responseJson)

  } catch (error) {
    console.log(error)
  }
}

const getStops = async (routecode) => {
  try {
    const response = await fetch(
      `http://telematics.oasa.gr/api/?act=webGetStops&p1=${routecode}`
    )
    if (response == null) {
      throw new Error('null response')
    }
    const responseJson = await response.json();
    console.log('got stops')
    return(responseJson)
  } catch (error) {
    console.log(error)
  }
}

const getTimes = async (stopcode) => {
  try {
    const response = await fetch(
      `http://telematics.oasa.gr/api/?act=getStopArrivals&p1=${stopcode}`
    )
    if (response == 'null') {
      throw new Error('null response')
    }
    const responseJson = await response.json();
    console.log('got times')
    return(responseJson)
  } catch (error) {
    console.log(error)
  }
}

export { getLineInfo, getRoutes, getStops, getTimes }