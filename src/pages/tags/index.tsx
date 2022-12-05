
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAPI from '../../@core/hooks/useAPI'

import { Audio } from  'react-loader-spinner'
import { Router } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import moment from 'moment';
interface Ranking {
    tag: string;
    difficulty: number;
    count: number;
}

function cleanString(input: string) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

function TagRow({tag, index}: any) {

    const router = useRouter();
   function handleRowClick() {
        router.push(`/top/${tag.tag}`)
   }

    return (
        <TableRow onClick={handleRowClick} key={index} sx={{ '&:last-of-type .MuiTableCell-root ': { border: 0 } }}>
        <TableCell>
          {tag.tag}
        </TableCell>
        <TableCell>{tag.difficulty}</TableCell>
        <TableCell>{tag.count}</TableCell>
      </TableRow>
    )
}

export default function TagsList() {

    const [tags, setTags] = useState<Ranking[]>()
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        
        const start_date = moment('01/01/2022').unix()

        axios.get(`https://pow.co/api/v1/boost/rankings/tags?start_date=${start_date}`)
            .then(({data}: {data: any}) => {

                const tags = data.rankings.map((ranking: Ranking) => {
        
                    var tag = ranking.tag
        
                    try {
        
                        tag = Buffer.from(ranking.tag, 'hex').toString()
        
                        tag = cleanString(tag)
        
                    } catch(error) {
        
                        tag = ''
        
                    }
        
                    return Object.assign(ranking, {
                        tag
                    })
                })
                .filter((tag: any) => !/\s/.test(tag.tag))
                .filter((tag: any) => !/[&\/\\#,()$~%'":?<>{}]/.test(tag.tag))
                .filter((tag: any) => tag.tag != '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00')
                .filter((tag: any) => tag.tag != '')
        
            

                setTags(tags)

                console.log('TAGS', tags)

                setLoading(false)

            })


    }, [])

    if (loading) {
        return <Box sx={{textAlign: 'center', display: 'flex', alignItems: 'vertical'}}><Audio
            height = {80}
            width = {80}
            color = 'green'
            ariaLabel = 'three-dots-loading'     
        />
        </Box>
    }

    function handleRowClick(event: any) {

        console.log('row clicked target', event.target)
        
    }

    return <>
            <h1>Top Tags</h1>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                      <TableCell>Tag</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tags && tags.map((tag: Ranking, index: number) => (

                    <TagRow tag={tag} index={index}></TagRow>

                  ))}
                </TableBody>
              </Table>
            </TableContainer>

    </>

}