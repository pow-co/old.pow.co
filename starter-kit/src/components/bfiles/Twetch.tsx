
import { request } from 'graphql-request'

const graphqlAPI = "https://gw.twetch.app";

export const postDetailQuery = async (txid: string) => {
  console.log(txid)
  const query = `
  query postDetailQuery($txid: String!) {
    allPosts(condition: { transaction: $txid }) {
      edges {
        node {
          bContent
          bContentType
          createdAt
          files
          id
          numBranches
          numLikes
          postsByReplyPostId {
            totalCount
          }
          replyPostId
          transaction
          type
          youBranchedCalc
          youLikedCalc
          userId
          userByUserId {
            icon
            name
          }
        }
      }
    }
  }
  `;

  //const result = await graphqlClient.request(query, { txid });
  const result = await request(graphqlAPI, query, { txid });

  if (!result?.allPosts?.edges || result?.allPosts?.edges.length === 0) {
    return null
  }

  return result.allPosts.edges[0].node;
};


import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react"

export default function Twetch({ txid }: { txid: string }) {

    const [post, setPost] = useState<any>()

    useEffect(() => {

        (async () => {

            const result = await postDetailQuery(txid)

            console.log("twetch.post.detail", result)

            setPost(result)

        })()

    }, [])

    if (post) {
        return <Box>
            <p>
                <Image style={{borderRadius: '50%'}} width={'30px'} height={'30px'} src={'https://media.twetch.app/dyt/256x256/23927e8fe0014aef65fd88c345d3dd49f4ee3db145c318c7157df61194519223.png'} />
                <Image style={{borderRadius: '50%'}} width={'30px'} height={'30px'} src={post?.userByUserId?.icon} />
                u/{post?.userId} {post?.userByUserId?.name}
            </p>
            <br/>
            {post.bContent}
        </Box>

    } else {
        return <></>
    }
    
    


}
