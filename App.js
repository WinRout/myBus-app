import { StatusBar } from 'expo-status-bar';
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
  const [stops, setStops] = useState([])
  const [stopcode, setStopcode] = useState(null)

  const avatar = 'https://www.dailythess.gr/wp-content/uploads/2019/08/koulis-gkrimatses.jpg'




  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Γεια! Ποιό λεωφορείο θες να πάρεις;',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'myBus',
          avatar: avatar,
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
        routes.push({title: 'Από την αρχή', value: 'restart'})
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
        let routes = []
        data.forEach(element => {
          routes.push({title: element.StopDescr, value: element.StopCode})
        })
        routes.push({title: 'Από την αρχή', value: 'restart'})
        console.log(routes)
        sendMessage([ 
          {
            _id: Math.random(),
            text: 'Από ποιά στάση θες να πάρεις το λεωφορείο;',
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
        return ('stopcode')
      })
  } catch(error) {
    console.log(error)
  }

  }, [routecode])




  useEffect(() => {
    try {
      if (stopcode == null) {
        throw new Error('stopcode null')
      }

      setFun( async () => {
        console.log(stopcode)
        const data = await getTimes(stopcode)
        console.log(data)
        if (data == null) {
          sendMessage([ 
            {
              _id: Math.random(),
              text: `Το λεωφορείο σου δεν έχει ξεκινήσει ακόμα...`,
              createdAt: new Date(),
              quickReplies: {
                type: 'radio',
                keepIt: false,
                values: [{title: 'Από την αρχή', value: 'restart'}] 
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
        data.forEach(element => {
          if (element.route_code == routecode) {
            minutes.push(element.btime2)
          }
        })
        sendMessage([ 
          {
            _id: Math.random(),
            text: `Το λεωφορείο σου έρχεται σε ${minutes}'`,
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              keepIt: false,
              values: [{title: 'Από την αρχή', value: 'restart'}]
            },
            user: {
              _id: 2,
              name: 'myBus',
              avatar: avatar,
            },
          },
        ])
        return ('time')
      })
  } catch(error) {
    console.log(error)
  }

  }, [stopcode])






  const onSend = (messages = []) => {
    print(fun)

    sendMessage(messages)

    if (fun == 'bus') {
      const lineID = latinToGreek(messages[0].text)

      console.log(lineID)
      
      const lineArr = lineInfo._j
      
      let linefound = false

      try {
        lineArr.forEach(element => {
          if (element.LineID == lineID) {
            linefound = true

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
    
  }

  const onQuickReply = (quickReply) => {
    console.log(quickReply[0])
    sendMessage([
      {
        _id: Math.random(),
        text: quickReply[0].title,
        createdAt: new Date(),
        user: {
          _id: 1,
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
        return 'bus'
      })
    } else if (fun._j=='routecode') {
        console.log('routeCode:', quickReply[0].value);
        setRoutecode(quickReply[0].value)
    } else if (fun._j=='stopcode') {
        console.log('stopCode:', quickReply[0].value);
        setStopcode(quickReply[0].value)
    }
  }

  return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Πότε θα έρθει το λεωφορείο ρε Κούλη?</Text>
          </View>
          <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          onQuickReply={quickReply => onQuickReply(quickReply)}
          user={{
            _id: 1,
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
    height: 80,
    backgroundColor: 'gray',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerText: {
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: 700

  }
});
