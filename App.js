import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react'

import { GiftedChat } from 'react-native-gifted-chat';
import { getLineInfo, getRoutes, getStops, getTimes } from './fuctions';
import { latinToGreek } from './latinToGreek';

export default function App() {
  const [messages, setMessages] = useState([])
  const [fun, setFun] = useState('bus')
  const [lineInfo, setLineInfo] = useState([])
  const [linecode, setLinecode] = useState(null)
  const [routecode, setRoutecode] = useState(null)
  const [stopcode, setStopcode] = useState(null)
  const [rerender, setRerender] = useState(0)
  const [stopsGl, setStopsGl] = useState([])
  const [routesGl, setRoutesGl] = useState([])

  const avatar = 'https://www.dailythess.gr/wp-content/uploads/2019/08/koulis-gkrimatses.jpg'

  const restart_option = {title: 'Πάμε ξανά🚍', value: 'restart'}



  useEffect(() => {
    setMessages([
      
      {
        _id: 2,
        text: 'Ποιο λεωφορείο θες να πάρεις;',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'myBus',
          avatar: avatar,
        },
      },
      {
        _id: 1,
        text: ' Ρε Κούλη, πότε θα έρθει το λεωφορείο;',
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      },
    ])
    setLineInfo(async () => await getLineInfo())
  }, [])


  const sendMessage = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])






  useEffect(() => {
    try {
      if (linecode == null) {
        throw new Error('linecode null')
      }

      setFun( async () => {
        console.log(linecode)
        const data = await getRoutes(linecode)
        console.log(data)
        let routes = []
        data.forEach(element => {
          routes.push({title: element.RouteDescr, value: element.RouteCode})
        })
        routes.push(restart_option)
        setRoutesGl(routes)
        console.log(routes)
        sendMessage([ 
          {
            _id: Math.random(),
            text: 'Ποια διαδρομή θες να κάνεις;',
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              keepIt: false,
              values: routes 
            },
            user: {
              _id: 2,
              name: 'myBus',
              avatar: avatar,
            },
          },
        ])
        return ('routecode')
      })
  } catch(error) {
    console.log(error)
  }

  }, [linecode])





  useEffect(() => {
    try {
      if (routecode == null) {
        throw new Error('routecode null')
      }

      setFun( async () => {
        console.log(routecode)
        const data = await getStops(routecode)
        console.log(data)
        let stops = []
        data.forEach(element => {
          stops.push({title: element.StopDescr, value: element.StopCode})
        })
        stops.push(restart_option)
        setStopsGl(stops)
        console.log(stops)
        sendMessage([ 
          {
            _id: Math.random(),
            text: 'Από ποια στάση θες να πάρεις το λεωφορείο;',
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              keepIt: false,
              values: stops
            },
            user: {
              _id: 2,
              name: 'myBus',
              avatar: avatar,
            },
          },
        ])
        return ('stopcode')
      })
  } catch(error) {
    console.log(error)
  }

  }, [routecode])




  useEffect(() => {
    try {
      if (rerender == null) {
        setRerender(false)
        throw new Error('rerender null')
      }
      if (stopcode == null) {
        throw new Error('stopcode null')
      }
      if (rerender == 0) {
        throw new Error('rerender 0')
      }

      setFun( async () => {
        console.log(stopcode)
        const data = await getTimes(stopcode)
        console.log(data)
        if (data == null) {
          sendMessage([ 
            {
              _id: Math.random(),
              text: `Φαίνεται να μην έρχεται κανένα λεωφορείο σε αυτή την στάση...`,
              image: 'https://media.tenor.com/1TW5q7gVlwkAAAAC/mitsotakis-koulis.gif',
              createdAt: new Date(),
              quickReplies: {
                type: 'radio',
                keepIt: false,
                values: [restart_option] 
              },
              user: {
                _id: 2,
                name: 'myBus',
                avatar: avatar,
              },
            },
          ])
          return ('bus')
        }
        console.log(data)
        let minutes = []
        let minutesStr = []
        let isComing = false
        data.forEach(element => {
          console.log(routecode)
          if (element.route_code == routecode) {
            isComing = true
            minutes.push(element.btime2)
            console.log(minutes) 
          } 
        })
        if (isComing) {
          minutes.forEach((element) => {
            minutesStr.push(` ${element}'`)
          })
          sendMessage([
            {
              _id: Math.random(),
              text: `Το λεωφορείο σου έρχεται σε${minutesStr}`,
              createdAt: new Date(),
              quickReplies: {
                type: 'radio',
                keepIt: false,
                values: [{title: 'Ανανέωση🔃', value: 'again'}, restart_option]
              },
              user: {
                _id: 2,
                name: 'myBus',
                avatar: avatar,
              },
            },
          ])
          return ('time')
        }

        else {
          sendMessage([ 
            {
              _id: Math.random(),
              text: `Το λεωφορείο σου δεν έχει ξεκινήσει ακόμα...`,
              createdAt: new Date(),
              quickReplies: {
                type: 'radio',
                keepIt: false,
                values: [restart_option]
              },
              user: {
                _id: 2,
                name: 'myBus',
                avatar: avatar,
              },
            },
          ])
          return ('time')
        }
        
      })
  } catch(error) {
    console.log(error)
  }
  console.log('rerener: ', rerender)

  }, [stopcode, rerender])




  const onSend = (messages = []) => {
    console.log('fun: ', fun)
    sendMessage([
      {
        _id: Math.random(),
        text: messages[0].text,
        createdAt: new Date(),
        user: {
          _id: 1
        },
      },
    ])
    if (fun=='bus') {

      const lineID = latinToGreek(messages[0].text)

      console.log(lineID)
      
      const lineArr = lineInfo._j
      
      let linefound = false

      try {
        lineArr.forEach(element => {
          if (element.LineID == lineID) {
            linefound = true
            setFun('linecode')
            sendMessage([ 
                {
                  _id: Math.random(),
                  text: 'Τέλεια!',
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'myBus',
                    avatar: avatar,
                  },
                },
              ])
              throw ({message: 'line found', linecode: element.LineCode})
          } 
        });
        if (!linefound) {

              sendMessage([
                {
                  _id: Math.random(),
                  text: 'Συγγνώμη αλλά δεν μπόρεσα να βρω αυτή την γραμμή. Ξαναπροσπάθησε.',
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'myBus',
                    avatar: avatar,
                  },
                },
              ])

          }
      } catch (event) {

        console.log(event.message, ': ', event.linecode)
        setLinecode(event.linecode)
      }  

    }

    if (fun._j == 'routecode') {
      sendMessage([ 
        {
          _id: Math.random(),
          text: 'Πρέπει να επιλέξεις μία επιλογή από τις παρακάτω.',
          createdAt: new Date(),
          quickReplies: {
            type: 'radio',
            keepIt: false,
            values: routesGl
          },
          user: {
            _id: 2,
            name: 'myBus',
            avatar: avatar,
          },
        },
      ])
    }
    if (fun._j == 'stopcode') {
      stopName = latinToGreek(messages[0].text.toUpperCase())
      let foundStop = false
      stopsGl.forEach(element => {
        if (element.title == stopName) {
          foundStop = true
          console.log(element.title, element.value)
          setStopcode( () => {
            setRerender(1)
            return element.value
          })
        }
      });
      if (!foundStop) {
        sendMessage([ 
          {
            _id: Math.random(),
            text: 'Πρέπει να επιλέξεις μία επιλογή από τις παρακάτω.',
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              keepIt: false,
              values: stopsGl
            },
            user: {
              _id: 2,
              name: 'myBus',
              avatar: avatar,
            },
          },
        ])
      }
    }
    if(fun._j == 'time') {
      setRerender(prev => prev+1)
    }
  }




  const onQuickReply = (quickReply) => {
    console.log('fun: ', fun._j)
    console.log(quickReply[0])
    sendMessage([
      {
        _id: Math.random(),
        text: quickReply[0].title,
        createdAt: new Date(),
        user: {
          _id: 1
        },
      },
    ])
    if (quickReply[0].value=='restart') {
      setFun( () => {
        sendMessage([
          {
            _id: Math.random(),
            text: 'Ποιό λεωφορείο θες να πάρεις;',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'myBus',
              avatar: avatar,
            },
          },
        ])
        setLinecode(null)
        setRoutecode(null)
        setStopcode(null)
        setRerender(0)
        setStopsGl([])
        setRoutesGl([])
        return 'bus'
      })
    } else if (fun._j=='routecode') {
        console.log('routeCode:', quickReply[0].value);
        setRoutecode(quickReply[0].value)
    } else if (fun._j=='stopcode') {
        console.log('stopCode:', quickReply[0].value);
        setStopcode( () => {
          setRerender(1)
          return quickReply[0].value
        })
    } else if (fun._j == 'time') {
      setRerender(prev => prev+1)
    }
  } 

  return (
    <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.headerText}>Κούλης</Text>
          </View>
          <GiftedChat
            listViewProps={{
              keyboardDismissMode: "on-drag"
            }}
            messages={messages}
            onSend={messages => onSend(messages)}
            onQuickReply={quickReply => onQuickReply(quickReply)}
            user={{
              _id: 1
            }}
          />
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    gap: 0
  },
  header: {
    height: 70,
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 10,
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700

  }
});