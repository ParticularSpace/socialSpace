import React, { useEffect } from 'react';
import { useQuery } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { GET_PERSONALIZED_POSTS } from "../graphql/queries";
import PostCard from '../components/Card';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('id_token');
        const decodedToken = jwt_decode(token);

        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('id_token');
            navigate('/login');
        }
    }, [navigate]);

    const token = localStorage.getItem('id_token');
    const decodedToken = jwt_decode(token);
    const currentUserId = decodedToken.data._id;

    const { loading, error, data } = useQuery(GET_PERSONALIZED_POSTS, {
        variables: { userId: currentUserId }
    });

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    const posts = data.userFeed;

    return (
    <div className="flex flex-col items-center mt-8 md:mt-16">
            <div className="flex flex-wrap justify-around w-full">
                <div className="overflow-y-auto overflow-x-hidden h-[80%] relative lg:items-start lg:justify-start items-center justify-center flex flex-col gap-y-0 lg:gap-y-4 md: mt-16" >
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} likes={post.likes} />
                    ))}
                </div>
            </div>

        </div>
    );
}
