
// import { NextResponse } from "next/server";
// import { fetchFollowerDemographics, fetchPostTypes, fetchMonthlyImpressions } from './helpers';

// export async function GET(request) {
//     const IG_PROFILE_ID = process.env.IG_PROFILE_ID;
//     const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

//     try {
//         // Fetch all metrics concurrently
//         const [followerDemographics, postTypes, monthlyImpressions] = await Promise.all([
//             fetchFollowerDemographics(IG_PROFILE_ID, IG_ACCESS_TOKEN),
//             fetchPostTypes(IG_PROFILE_ID, IG_ACCESS_TOKEN),
//             fetchMonthlyImpressions(IG_PROFILE_ID, IG_ACCESS_TOKEN),
//         ]);

//         // Format and calculate metrics
//         const totalImpressions = monthlyImpressions.dailyImpressions.reduce(
//             (sum, { impressions }) => sum + impressions,
//             0
//         );

//         const formattedDailyImpressions = monthlyImpressions.dailyImpressions.map(({ date, impressions }) => ({
//             date: new Date(date).toISOString().split("T")[0], // Format to "YYYY-MM-DD"
//             impressions,
//         }));

//         // Placeholder for previous total (to calculate percentage change if available)
//         // const previousTotal = monthlyImpressions.previousTotal || 0;
//         // const percentageChange =
//         //     previousTotal > 0 ? (((totalImpressions - previousTotal) / previousTotal) * 100).toFixed(2) : "N/A";

//         // Combine results
//         const combinedMetrics = {
//             followerDemographics,
//             postTypes,
//             monthlyImpressions: {
//                 totalImpressions,
//                 dailyImpressions: formattedDailyImpressions,
                
//             },
//         };

//         return NextResponse.json(combinedMetrics);
//     } catch (error) {
//         console.error("Error fetching combined metrics:", error.message);
//         return NextResponse.json(
//             { error: "Failed to fetch combined metrics. Please try again later." },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import { 
    fetchFollowerDemographics, 
    fetchPostTypes, 
    fetchMonthlyImpressions, 
    fetchFollowers, 
    fetchReach 
} from './helpers';

export async function GET(request) {
    const IG_PROFILE_ID = process.env.IG_PROFILE_ID;
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

    try {
        // Fetch all metrics concurrently
        const [
            followerDemographics,
            postTypes,
            monthlyImpressions,
            followers,
            reach
        ] = await Promise.all([
            fetchFollowerDemographics(IG_PROFILE_ID, IG_ACCESS_TOKEN),
            fetchPostTypes(IG_PROFILE_ID, IG_ACCESS_TOKEN),
            fetchMonthlyImpressions(IG_PROFILE_ID, IG_ACCESS_TOKEN),
            fetchFollowers(IG_PROFILE_ID, IG_ACCESS_TOKEN),
            fetchReach(IG_PROFILE_ID, IG_ACCESS_TOKEN)
        ]);

        // Format and calculate total impressions
        const totalImpressions = monthlyImpressions.dailyImpressions.reduce(
            (sum, { impressions }) => sum + impressions,
            0
        );

        const formattedDailyImpressions = monthlyImpressions.dailyImpressions.map(({ date, impressions }) => ({
            date: new Date(date).toISOString().split("T")[0], // Format to "YYYY-MM-DD"
            impressions,
        }));

        // Format reach data for 7 days (bar chart) and 30 days total
        const formattedReach7Days = reach.reach7Days.map(({ date, reach }) => ({
            date,
            reach,
        }));

        const totalReach30Days = reach.totalReach30Days;

        // Combine all metrics
        const combinedMetrics = {
            followerDemographics,
            postTypes,
            followers: followers.followersCount, // Add followers count
            monthlyImpressions: {
                totalImpressions,
                dailyImpressions: formattedDailyImpressions,
            },
            reach: {
                totalReach30Days,
                reach7Days: formattedReach7Days,
            },
        };

        return NextResponse.json(combinedMetrics);
    } catch (error) {
        console.error("Error fetching combined metrics:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch combined metrics. Please try again later." },
            { status: 500 }
        );
    }
}
