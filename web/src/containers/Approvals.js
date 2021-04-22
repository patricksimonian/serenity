import { useContext, useEffect, useState } from 'react';
import {Box, Flex, Text} from 'rebass';
import axios from '../axios';
import { WidthControlledContainer } from '../components/Containers';
import { Notice } from '../components/Notice';
import Request from '../components/Request';
import { AuthContext } from '../providers/AuthContext';
import { approveRequest, denyRequest } from '../utils/api';

export const Approvals = () => {
  const { state } = useContext(AuthContext)
  const [requests, setRequests] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [refetchRequests, setRefetchRequests] = useState(true);
  const token = state.token && state.token.access_token;


  useEffect(() => {
    if(refetchRequests || !requests) {
      setFetching(true);
      axios.get('/requests?state=PENDING').then(res => {
        setRequests(res.data);
      })
      .finally(() => {
        setFetching(false)
        setRefetchRequests(false)
      })
    }
  }, [refetchRequests, requests, token])

  const thereArePendingRequests = !fetching && requests && requests.length > 0;

  const handleApprove = async id => {
    await approveRequest(id, token)
    setRefetchRequests(true)
  }

  const handleDeny = async id => {
    await denyRequest(id, token)
    setRefetchRequests(true)
  }

  return (
    <WidthControlledContainer>
      <Box pt={4}>
        {!thereArePendingRequests && !refetchRequests && <Notice type="info">No Pending Requests!</Notice>}
        {thereArePendingRequests && <Text fontSize={5}>Pending Requests:</Text>}
        <Flex>
          {thereArePendingRequests && requests.map(r => 
            <Request 
              {...r} 
              username={r.recipient} 
              key={r._id} 
              onApprove={() => handleApprove(r._id)} onDeny={() => handleDeny(r._id)} />)}
        </Flex>
      </Box>
    </WidthControlledContainer>
  )
}

export default Approvals