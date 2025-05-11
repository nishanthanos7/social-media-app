// This file defines our Post model and related functions for the social media app
// It stores posts in memory for simplicity, but in a real app would use a database

// Import the user model to get user information
import { findUserById } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the post
 *           example: 1
 *         userId:
 *           type: integer
 *           description: The id of the user who created the post
 *           example: 1
 *         content:
 *           type: string
 *           description: The content of the post
 *           example: Just finished hiking Mount Rainier! The views were amazing. #hiking #nature
 *         postType:
 *           type: string
 *           description: The type of post (text, image, video, link)
 *           enum: [text, image, video, link]
 *           example: image
 *         imageUrl:
 *           type: string
 *           description: URL to an image attached to the post (optional)
 *           example: https://picsum.photos/id/10/800/600
 *         videoUrl:
 *           type: string
 *           description: URL to a video attached to the post (optional)
 *           example: https://example.com/video.mp4
 *         linkUrl:
 *           type: string
 *           description: URL to an external link (optional)
 *           example: https://example.com/article
 *         linkTitle:
 *           type: string
 *           description: Title of the linked content (optional)
 *           example: 10 Best Hiking Trails in Washington
 *         linkDescription:
 *           type: string
 *           description: Description of the linked content (optional)
 *           example: Explore the most scenic hiking trails in Washington state
 *         linkImage:
 *           type: string
 *           description: Image URL for the linked content (optional)
 *           example: https://picsum.photos/id/15/800/600
 *         privacy:
 *           type: string
 *           description: Privacy setting for the post
 *           enum: [public, friends, private]
 *           example: public
 *         location:
 *           type: string
 *           description: Location tag for the post (optional)
 *           example: Mount Rainier, WA
 *         taggedUsers:
 *           type: array
 *           description: List of user IDs tagged in this post
 *           items:
 *             type: integer
 *           example: [2, 3]
 *         reactions:
 *           type: object
 *           description: Counts of different reaction types
 *           properties:
 *             like:
 *               type: array
 *               items:
 *                 type: integer
 *             love:
 *               type: array
 *               items:
 *                 type: integer
 *             haha:
 *               type: array
 *               items:
 *                 type: integer
 *             wow:
 *               type: array
 *               items:
 *                 type: integer
 *             sad:
 *               type: array
 *               items:
 *                 type: integer
 *             angry:
 *               type: array
 *               items:
 *                 type: integer
 *           example: {"like":[2,3],"love":[4],"haha":[],"wow":[],"sad":[],"angry":[]}
 *         shareCount:
 *           type: integer
 *           description: Number of times this post has been shared
 *           example: 5
 *         originalPostId:
 *           type: integer
 *           description: ID of the original post if this is a shared post
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the post was created
 *           example: 2023-04-15T14:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the post was last updated
 *           example: 2023-04-15T14:30:00Z
 *     Comment:
 *       type: object
 *       required:
 *         - id
 *         - postId
 *         - userId
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the comment
 *           example: 1
 *         postId:
 *           type: integer
 *           description: The id of the post this comment belongs to
 *           example: 1
 *         userId:
 *           type: integer
 *           description: The id of the user who created the comment
 *           example: 2
 *         content:
 *           type: string
 *           description: The content of the comment
 *           example: Looks amazing! I need to go there sometime.
 *         parentId:
 *           type: integer
 *           description: ID of the parent comment if this is a reply
 *           example: null
 *         taggedUsers:
 *           type: array
 *           description: List of user IDs tagged in this comment
 *           items:
 *             type: integer
 *           example: []
 *         reactions:
 *           type: object
 *           description: Counts of different reaction types
 *           properties:
 *             like:
 *               type: array
 *               items:
 *                 type: integer
 *             love:
 *               type: array
 *               items:
 *                 type: integer
 *           example: {"like":[1],"love":[]}
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was created
 *           example: 2023-04-15T15:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was last updated
 *           example: 2023-04-15T15:00:00Z
 */

// This defines what a Post object looks like in our app
export interface Post {
  id: number;                // Unique identifier for the post
  userId: number;            // ID of the user who created the post
  content: string;           // Text content of the post
  postType: 'text' | 'image' | 'video' | 'link'; // Type of post
  imageUrl?: string;         // Optional URL to an image
  videoUrl?: string;         // Optional URL to a video
  linkUrl?: string;          // Optional URL to an external link
  linkTitle?: string;        // Optional title for the linked content
  linkDescription?: string;  // Optional description for the linked content
  linkImage?: string;        // Optional image for the linked content
  privacy: 'public' | 'friends' | 'private'; // Privacy setting
  location?: string;         // Optional location tag
  taggedUsers?: number[];    // IDs of users tagged in the post
  reactions: {               // Different types of reactions
    like: number[];
    love: number[];
    haha: number[];
    wow: number[];
    sad: number[];
    angry: number[];
  };
  shareCount: number;        // Number of times shared
  originalPostId?: number;   // ID of original post if shared
  createdAt: Date;           // When the post was created
  updatedAt: Date;           // When the post was last updated
}

// This defines what a Comment object looks like in our app
export interface Comment {
  id: number;                // Unique identifier for the comment
  postId: number;            // ID of the post this comment belongs to
  userId: number;            // ID of the user who created the comment
  content: string;           // Text content of the comment
  parentId?: number;         // ID of parent comment if this is a reply
  taggedUsers?: number[];    // IDs of users tagged in the comment
  reactions: {               // Different types of reactions
    like: number[];
    love: number[];
  };
  createdAt: Date;           // When the comment was created
  updatedAt: Date;           // When the comment was last updated
}

// This creates our in-memory database of posts with realistic data
export const posts: Post[] = [
  // Post 1: John's hiking post
  {
    id: 1,
    userId: 1, // John Doe
    content: "Just finished hiking Mount Rainier! The views were amazing. #hiking #nature",
    postType: "image",
    imageUrl: "https://picsum.photos/id/10/800/600", // Nature image
    privacy: "public",
    location: "Mount Rainier, WA",
    taggedUsers: [3], // Tagged Mike
    reactions: {
      like: [2, 3], // Liked by Jane and Mike
      love: [4], // Loved by Sarah
      haha: [],
      wow: [5], // Wow from David
      sad: [],
      angry: []
    },
    shareCount: 3,
    createdAt: new Date('2023-04-15T14:30:00Z'),
    updatedAt: new Date('2023-04-15T14:30:00Z')
  },
  // Post 2: Jane's design post
  {
    id: 2,
    userId: 2, // Jane Doe
    content: "Finished a new logo design for a client today. What do you think? #design #logo",
    postType: "image",
    imageUrl: "https://picsum.photos/id/20/800/600", // Design image
    privacy: "public",
    location: "Portland Design Studio",
    taggedUsers: [],
    reactions: {
      like: [1, 3, 4], // Liked by John, Mike, and Sarah
      love: [8], // Loved by Olivia
      haha: [],
      wow: [10], // Wow from Sophia
      sad: [],
      angry: []
    },
    shareCount: 2,
    createdAt: new Date('2023-04-16T10:15:00Z'),
    updatedAt: new Date('2023-04-16T10:15:00Z')
  },
  // Post 3: Mike's photography post
  {
    id: 3,
    userId: 3, // Mike Smith
    content: "Captured this sunset at the beach yesterday. No filters needed! #photography #sunset",
    postType: "image",
    imageUrl: "https://picsum.photos/id/30/800/600", // Sunset image
    privacy: "public",
    location: "Ocean Beach, San Francisco",
    taggedUsers: [],
    reactions: {
      like: [1, 2], // Liked by John and Jane
      love: [9, 6], // Loved by William and Emily
      haha: [],
      wow: [4, 7], // Wow from Sarah and Robert
      sad: [],
      angry: []
    },
    shareCount: 5,
    createdAt: new Date('2023-04-17T19:45:00Z'),
    updatedAt: new Date('2023-04-17T19:45:00Z')
  },
  // Post 4: Sarah's yoga post
  {
    id: 4,
    userId: 4, // Sarah Johnson
    content: "Morning yoga session to start the day right. #yoga #wellness #morning",
    postType: "image",
    imageUrl: "https://picsum.photos/id/40/800/600", // Yoga image
    privacy: "public",
    location: "Sunrise Yoga Studio, LA",
    taggedUsers: [12], // Tagged Ava
    reactions: {
      like: [7, 10, 14], // Liked by Robert, Sophia, and Isabella
      love: [2],  // Loved by Jane
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 1,
    createdAt: new Date('2023-04-18T07:30:00Z'),
    updatedAt: new Date('2023-04-18T07:30:00Z')
  },
  // Post 5: John's work post
  {
    id: 5,
    userId: 1, // John Doe
    content: "Excited to announce I'm starting a new project next week! #coding #career",
    postType: "text",
    privacy: "public",
    taggedUsers: [],
    reactions: {
      like: [2, 5, 9], // Liked by Jane, David, and William
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 0,
    createdAt: new Date('2023-04-19T11:20:00Z'),
    updatedAt: new Date('2023-04-19T11:20:00Z')
  },
  // Post 6: David's music post
  {
    id: 6,
    userId: 5, // David Wilson
    content: "Just released a new track! Check it out on SoundCloud. #music #producer",
    postType: "link",
    linkUrl: "https://soundcloud.com/example/track",
    linkTitle: "New Summer Beats - David Wilson",
    linkDescription: "The latest electronic track from Nashville-based producer David Wilson",
    linkImage: "https://picsum.photos/id/50/800/600",
    privacy: "public",
    location: "Harmony Studios, Nashville",
    taggedUsers: [],
    reactions: {
      like: [1, 2, 11], // Liked by John, Jane, and James
      love: [8, 14], // Loved by Olivia and Isabella
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 4,
    createdAt: new Date('2023-04-20T15:45:00Z'),
    updatedAt: new Date('2023-04-20T15:45:00Z')
  },
  // Post 7: Emily's cooking post
  {
    id: 7,
    userId: 6, // Emily Chen
    content: "Made this amazing ramen from scratch today! Recipe in comments. #cooking #foodie",
    postType: "image",
    imageUrl: "https://picsum.photos/id/60/800/600", // Food image
    privacy: "public",
    location: "Boston, MA",
    taggedUsers: [],
    reactions: {
      like: [9, 13, 18], // Liked by William, Ethan, and Charlotte
      love: [2, 10], // Loved by Jane and Sophia
      haha: [],
      wow: [4], // Wow from Sarah
      sad: [],
      angry: []
    },
    shareCount: 7,
    createdAt: new Date('2023-04-21T19:30:00Z'),
    updatedAt: new Date('2023-04-21T19:30:00Z')
  },
  // Post 8: Robert's fitness post
  {
    id: 8,
    userId: 7, // Robert Johnson
    content: "New personal record on deadlift today! 💪 #fitness #gym #personaltrainer",
    postType: "video",
    videoUrl: "https://example.com/videos/deadlift.mp4",
    privacy: "public",
    location: "FitLife Gym, Miami",
    taggedUsers: [1], // Tagged John
    reactions: {
      like: [1, 4, 13], // Liked by John, Sarah, and Ethan
      love: [],
      haha: [],
      wow: [3, 9], // Wow from Mike and William
      sad: [],
      angry: []
    },
    shareCount: 2,
    createdAt: new Date('2023-04-22T11:15:00Z'),
    updatedAt: new Date('2023-04-22T11:15:00Z')
  },
  // Post 9: Olivia's travel post
  {
    id: 9,
    userId: 8, // Olivia Martinez
    content: "Just landed in Paris for a week of exploration! Any recommendations? #travel #paris",
    postType: "image",
    imageUrl: "https://picsum.photos/id/70/800/600", // Paris image
    privacy: "public",
    location: "Paris, France",
    taggedUsers: [],
    reactions: {
      like: [2, 5, 12, 15], // Liked by Jane, David, Ava, and Noah
      love: [10, 14], // Loved by Sophia and Isabella
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 3,
    createdAt: new Date('2023-04-23T08:45:00Z'),
    updatedAt: new Date('2023-04-23T08:45:00Z')
  },
  // Post 10: William's gaming post
  {
    id: 10,
    userId: 9, // William Taylor
    content: "Just finished developing a new game feature! Beta testers needed. #gamedev #coding",
    postType: "image",
    imageUrl: "https://picsum.photos/id/80/800/600", // Game screenshot
    privacy: "public",
    location: "GameDev Studios, Austin",
    taggedUsers: [3, 6], // Tagged Mike and Emily
    reactions: {
      like: [1, 3, 6], // Liked by John, Mike, and Emily
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 1,
    createdAt: new Date('2023-04-24T14:20:00Z'),
    updatedAt: new Date('2023-04-24T14:20:00Z')
  },
  // Post 11: Sophia's fashion post
  {
    id: 11,
    userId: 10, // Sophia Lee
    content: "New sustainable fashion collection launching next month! #fashion #sustainability",
    postType: "image",
    imageUrl: "https://picsum.photos/id/90/800/600", // Fashion image
    privacy: "public",
    location: "EcoChic Studio, Chicago",
    taggedUsers: [2, 8], // Tagged Jane and Olivia
    reactions: {
      like: [2, 4, 8, 14], // Liked by Jane, Sarah, Olivia, and Isabella
      love: [12, 18], // Loved by Ava and Charlotte
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 8,
    createdAt: new Date('2023-04-25T09:30:00Z'),
    updatedAt: new Date('2023-04-25T09:30:00Z')
  },
  // Post 12: James's finance tip
  {
    id: 12,
    userId: 11, // James Wilson
    content: "Three investment tips for beginners: 1) Start early 2) Diversify 3) Be patient #finance #investing",
    postType: "text",
    privacy: "public",
    location: "Denver, CO",
    taggedUsers: [],
    reactions: {
      like: [5, 9, 17], // Liked by David, William, and Alexander
      love: [],
      haha: [],
      wow: [1, 15], // Wow from John and Noah
      sad: [],
      angry: []
    },
    shareCount: 5,
    createdAt: new Date('2023-04-26T16:15:00Z'),
    updatedAt: new Date('2023-04-26T16:15:00Z')
  },
  // Post 13: Ava's teaching post
  {
    id: 13,
    userId: 12, // Ava Brown
    content: "My students made these beautiful art projects today! So proud of them. #teaching #elementary",
    postType: "image",
    imageUrl: "https://picsum.photos/id/100/800/600", // Classroom art
    privacy: "friends",
    location: "Lakeside Elementary, Minneapolis",
    taggedUsers: [],
    reactions: {
      like: [4, 8, 15], // Liked by Sarah, Olivia, and Noah
      love: [2, 10, 18], // Loved by Jane, Sophia, and Charlotte
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 2,
    createdAt: new Date('2023-04-27T13:40:00Z'),
    updatedAt: new Date('2023-04-27T13:40:00Z')
  },
  // Post 14: Ethan's environmental post
  {
    id: 14,
    userId: 13, // Ethan Davis
    content: "Our team just completed a major river cleanup project! 500 lbs of trash removed. #environment #conservation",
    postType: "image",
    imageUrl: "https://picsum.photos/id/110/800/600", // River cleanup
    privacy: "public",
    location: "Boulder Creek, CO",
    taggedUsers: [16, 20], // Tagged Mia and Amelia
    reactions: {
      like: [6, 10, 16, 20], // Liked by Emily, Sophia, Mia, and Amelia
      love: [3, 15], // Loved by Mike and Noah
      haha: [],
      wow: [1, 4], // Wow from John and Sarah
      sad: [],
      angry: []
    },
    shareCount: 12,
    createdAt: new Date('2023-04-28T10:20:00Z'),
    updatedAt: new Date('2023-04-28T10:20:00Z')
  },
  // Post 15: Isabella's nutrition post
  {
    id: 15,
    userId: 14, // Isabella Garcia
    content: "Five foods that boost your immune system naturally! Check out my latest blog post. #nutrition #health",
    postType: "link",
    linkUrl: "https://example.com/nutrition-blog",
    linkTitle: "Immune-Boosting Foods - Wellness Blog",
    linkDescription: "Discover the top 5 foods that can naturally strengthen your immune system",
    linkImage: "https://picsum.photos/id/120/800/600",
    privacy: "public",
    location: "San Diego, CA",
    taggedUsers: [],
    reactions: {
      like: [4, 7, 10], // Liked by Sarah, Robert, and Sophia
      love: [2, 12], // Loved by Jane and Ava
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 6,
    createdAt: new Date('2023-04-29T15:10:00Z'),
    updatedAt: new Date('2023-04-29T15:10:00Z')
  },
  // Post 16: Noah's architecture post
  {
    id: 16,
    userId: 15, // Noah Miller
    content: "Just completed this sustainable building design. Proud of our team's work! #architecture #sustainability",
    postType: "image",
    imageUrl: "https://picsum.photos/id/130/800/600", // Building design
    privacy: "public",
    location: "Urban Designs, Philadelphia",
    taggedUsers: [],
    reactions: {
      like: [1, 5, 13], // Liked by John, David, and Ethan
      love: [8, 18], // Loved by Olivia and Charlotte
      haha: [],
      wow: [2, 10], // Wow from Jane and Sophia
      sad: [],
      angry: []
    },
    shareCount: 4,
    createdAt: new Date('2023-04-30T11:25:00Z'),
    updatedAt: new Date('2023-04-30T11:25:00Z')
  },
  // Post 17: Mia's veterinary post
  {
    id: 17,
    userId: 16, // Mia Thompson
    content: "Meet our newest rescue! This little guy is looking for a forever home. #adoption #animalrescue",
    postType: "image",
    imageUrl: "https://picsum.photos/id/140/800/600", // Puppy image
    privacy: "public",
    location: "Peachtree Animal Clinic, Atlanta",
    taggedUsers: [],
    reactions: {
      like: [2, 4, 8, 10, 12, 14, 18, 20], // Liked by many
      love: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], // Loved by many
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 25,
    createdAt: new Date('2023-05-01T09:15:00Z'),
    updatedAt: new Date('2023-05-01T09:15:00Z')
  },
  // Post 18: Alexander's car post
  {
    id: 18,
    userId: 17, // Alexander White
    content: "Just finished restoring this 1967 Mustang. A labor of love! #classiccar #restoration",
    postType: "image",
    imageUrl: "https://picsum.photos/id/150/800/600", // Classic car
    privacy: "public",
    location: "Detroit, MI",
    taggedUsers: [],
    reactions: {
      like: [1, 5, 9, 11, 15], // Liked by John, David, William, James, and Noah
      love: [3, 7], // Loved by Mike and Robert
      haha: [],
      wow: [13, 19], // Wow from Ethan and Benjamin
      sad: [],
      angry: []
    },
    shareCount: 7,
    createdAt: new Date('2023-05-02T14:50:00Z'),
    updatedAt: new Date('2023-05-02T14:50:00Z')
  },
  // Post 19: Charlotte's baking post
  {
    id: 19,
    userId: 18, // Charlotte Harris
    content: "My award-winning chocolate soufflé recipe is now on the blog! #baking #dessert #recipe",
    postType: "link",
    linkUrl: "https://example.com/food-blog/souffle",
    linkTitle: "Perfect Chocolate Soufflé - Food & Flavor Blog",
    linkDescription: "Step-by-step guide to making the perfect chocolate soufflé every time",
    linkImage: "https://picsum.photos/id/160/800/600",
    privacy: "public",
    location: "New Orleans, LA",
    taggedUsers: [12], // Tagged Ava
    reactions: {
      like: [2, 4, 6, 8, 10, 12], // Liked by many women
      love: [14, 16, 20], // Loved by Isabella, Mia, and Amelia
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 9,
    createdAt: new Date('2023-05-03T11:30:00Z'),
    updatedAt: new Date('2023-05-03T11:30:00Z')
  },
  // Post 20: Benjamin's cybersecurity post
  {
    id: 20,
    userId: 19, // Benjamin Clark
    content: "5 simple steps to protect your online privacy today. #cybersecurity #privacy #tech",
    postType: "text",
    privacy: "public",
    location: "Washington, DC",
    taggedUsers: [],
    reactions: {
      like: [1, 3, 6, 9, 13, 17], // Liked by tech-oriented people
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 11,
    createdAt: new Date('2023-05-04T16:45:00Z'),
    updatedAt: new Date('2023-05-04T16:45:00Z')
  },
  // Post 21: Amelia's ocean conservation post
  {
    id: 21,
    userId: 20, // Amelia Lewis
    content: "Our team tagged 15 endangered sea turtles today as part of our conservation efforts. #oceanconservation #marine #science",
    postType: "image",
    imageUrl: "https://picsum.photos/id/170/800/600", // Sea turtle
    privacy: "public",
    location: "North Shore, Oahu, HI",
    taggedUsers: [13], // Tagged Ethan
    reactions: {
      like: [2, 4, 6, 8, 10, 12, 14, 16, 18], // Liked by many
      love: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], // Loved by many
      haha: [],
      wow: [2, 4, 6], // Wow from Jane, Sarah, and Emily
      sad: [],
      angry: []
    },
    shareCount: 18,
    createdAt: new Date('2023-05-05T08:20:00Z'),
    updatedAt: new Date('2023-05-05T08:20:00Z')
  },
  // Post 22: John's shared post (sharing Mike's photography post)
  {
    id: 22,
    userId: 1, // John Doe
    content: "Mike always captures the most amazing shots! #repost",
    postType: "image",
    imageUrl: "https://picsum.photos/id/30/800/600", // Same as Mike's post
    privacy: "public",
    originalPostId: 3, // Reference to Mike's post
    taggedUsers: [3], // Tagged Mike
    reactions: {
      like: [2, 3, 4], // Liked by Jane, Mike, and Sarah
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 0,
    createdAt: new Date('2023-05-06T10:15:00Z'),
    updatedAt: new Date('2023-05-06T10:15:00Z')
  },
  // Post 23: Jane's design tips
  {
    id: 23,
    userId: 2, // Jane Doe
    content: "3 design principles every beginner should know: 1) Balance 2) Contrast 3) Hierarchy #design #tips",
    postType: "text",
    privacy: "public",
    location: "Portland, OR",
    taggedUsers: [],
    reactions: {
      like: [1, 3, 8, 10, 18], // Liked by several
      love: [4, 12], // Loved by Sarah and Ava
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 3,
    createdAt: new Date('2023-05-07T13:40:00Z'),
    updatedAt: new Date('2023-05-07T13:40:00Z')
  },
  // Post 24: Mike's travel throwback
  {
    id: 24,
    userId: 3, // Mike Smith
    content: "Throwback to my trip to Japan last year. Can't wait to go back! #travel #japan #throwback",
    postType: "image",
    imageUrl: "https://picsum.photos/id/180/800/600", // Japan photo
    privacy: "public",
    location: "Tokyo, Japan",
    taggedUsers: [],
    reactions: {
      like: [1, 2, 4, 8], // Liked by John, Jane, Sarah, and Olivia
      love: [6, 9], // Loved by Emily and William
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 2,
    createdAt: new Date('2023-05-08T17:25:00Z'),
    updatedAt: new Date('2023-05-08T17:25:00Z')
  },
  // Post 25: Sarah's marketing webinar
  {
    id: 25,
    userId: 4, // Sarah Johnson
    content: "Hosting a free webinar on social media marketing strategies next week! Link to register in comments. #marketing #webinar",
    postType: "text",
    privacy: "public",
    location: "Los Angeles, CA",
    taggedUsers: [2, 10], // Tagged Jane and Sophia
    reactions: {
      like: [1, 2, 6, 8, 10, 12, 14, 18], // Liked by many
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 7,
    createdAt: new Date('2023-05-09T11:10:00Z'),
    updatedAt: new Date('2023-05-09T11:10:00Z')
  }
];

// This creates our in-memory database of comments with realistic data
export const comments: Comment[] = [
  // Comment 1: Jane's comment on John's hiking post
  {
    id: 1,
    postId: 1,
    userId: 2, // Jane Doe
    content: "Looks amazing! I need to go there sometime.",
    taggedUsers: [],
    reactions: {
      like: [1, 3], // Liked by John and Mike
      love: []
    },
    createdAt: new Date('2023-04-15T15:00:00Z'),
    updatedAt: new Date('2023-04-15T15:00:00Z')
  },
  // Comment 2: Mike's comment on John's hiking post
  {
    id: 2,
    postId: 1,
    userId: 3, // Mike Smith
    content: "Great shot! What camera did you use?",
    taggedUsers: [],
    reactions: {
      like: [1], // Liked by John
      love: []
    },
    createdAt: new Date('2023-04-15T16:30:00Z'),
    updatedAt: new Date('2023-04-15T16:30:00Z')
  },
  // Comment 3: John's reply to Mike's comment
  {
    id: 3,
    postId: 1,
    userId: 1, // John Doe
    content: "Thanks! Just used my phone camera actually.",
    parentId: 2, // Reply to Mike's comment
    taggedUsers: [3], // Tagged Mike
    reactions: {
      like: [3, 2], // Liked by Mike and Jane
      love: []
    },
    createdAt: new Date('2023-04-15T17:15:00Z'),
    updatedAt: new Date('2023-04-15T17:15:00Z')
  },
  // Comment 4: John's comment on Jane's design post
  {
    id: 4,
    postId: 2,
    userId: 1, // John Doe
    content: "Love the color scheme! Very modern.",
    taggedUsers: [],
    reactions: {
      like: [2], // Liked by Jane
      love: []
    },
    createdAt: new Date('2023-04-16T11:00:00Z'),
    updatedAt: new Date('2023-04-16T11:00:00Z')
  },
  // Comment 5: Sarah's comment on Mike's photography post
  {
    id: 5,
    postId: 3,
    userId: 4, // Sarah Johnson
    content: "Breathtaking! You have a great eye for composition.",
    taggedUsers: [],
    reactions: {
      like: [3], // Liked by Mike
      love: []
    },
    createdAt: new Date('2023-04-17T20:30:00Z'),
    updatedAt: new Date('2023-04-17T20:30:00Z')
  },
  // Comment 6: David's comment on John's work post
  {
    id: 6,
    postId: 5,
    userId: 5, // David Wilson
    content: "Congrats! What kind of project is it?",
    taggedUsers: [],
    reactions: {
      like: [1], // Liked by John
      love: []
    },
    createdAt: new Date('2023-04-19T12:05:00Z'),
    updatedAt: new Date('2023-04-19T12:05:00Z')
  },
  // Comment 7: John's reply to David
  {
    id: 7,
    postId: 5,
    userId: 1, // John Doe
    content: "A new social media platform! I'll tell you more when we meet.",
    parentId: 6, // Reply to David's comment
    taggedUsers: [5], // Tagged David
    reactions: {
      like: [5, 2], // Liked by David and Jane
      love: []
    },
    createdAt: new Date('2023-04-19T13:20:00Z'),
    updatedAt: new Date('2023-04-19T13:20:00Z')
  },
  // Comment 8: Olivia's comment on Emily's cooking post
  {
    id: 8,
    postId: 7,
    userId: 8, // Olivia Martinez
    content: "This looks delicious! Can you share the recipe?",
    taggedUsers: [],
    reactions: {
      like: [6], // Liked by Emily
      love: []
    },
    createdAt: new Date('2023-04-21T20:15:00Z'),
    updatedAt: new Date('2023-04-21T20:15:00Z')
  },
  // Comment 9: Emily's reply with recipe
  {
    id: 9,
    postId: 7,
    userId: 6, // Emily Chen
    content: "Thanks! Here's the recipe: 1) Homemade broth with kombu and bonito flakes 2) Fresh ramen noodles 3) Chashu pork 4) Soft-boiled egg 5) Green onions and nori. Let me know if you try it!",
    parentId: 8, // Reply to Olivia's comment
    taggedUsers: [8], // Tagged Olivia
    reactions: {
      like: [8, 2, 4, 10], // Liked by Olivia, Jane, Sarah, and Sophia
      love: [12] // Loved by Ava
    },
    createdAt: new Date('2023-04-21T20:45:00Z'),
    updatedAt: new Date('2023-04-21T20:45:00Z')
  },
  // Comment 10: Mike's comment on William's gaming post
  {
    id: 10,
    postId: 10,
    userId: 3, // Mike Smith
    content: "This looks awesome! I'd be happy to help test it.",
    taggedUsers: [],
    reactions: {
      like: [9], // Liked by William
      love: []
    },
    createdAt: new Date('2023-04-24T15:10:00Z'),
    updatedAt: new Date('2023-04-24T15:10:00Z')
  },
  // Comment 11: William's reply to Mike
  {
    id: 11,
    postId: 10,
    userId: 9, // William Taylor
    content: "Great! I'll send you the beta access code via DM.",
    parentId: 10, // Reply to Mike's comment
    taggedUsers: [3], // Tagged Mike
    reactions: {
      like: [3], // Liked by Mike
      love: []
    },
    createdAt: new Date('2023-04-24T15:30:00Z'),
    updatedAt: new Date('2023-04-24T15:30:00Z')
  },
  // Comment 12: Jane's comment on Sophia's fashion post
  {
    id: 12,
    postId: 11,
    userId: 2, // Jane Doe
    content: "Love the sustainable approach! Would love to collaborate on some designs.",
    taggedUsers: [],
    reactions: {
      like: [10], // Liked by Sophia
      love: []
    },
    createdAt: new Date('2023-04-25T10:20:00Z'),
    updatedAt: new Date('2023-04-25T10:20:00Z')
  },
  // Comment 13: Sophia's reply to Jane
  {
    id: 13,
    postId: 11,
    userId: 10, // Sophia Lee
    content: "That would be amazing! Let's set up a meeting next week.",
    parentId: 12, // Reply to Jane's comment
    taggedUsers: [2], // Tagged Jane
    reactions: {
      like: [2, 8], // Liked by Jane and Olivia
      love: []
    },
    createdAt: new Date('2023-04-25T11:05:00Z'),
    updatedAt: new Date('2023-04-25T11:05:00Z')
  },
  // Comment 14: Noah's comment on Ethan's environmental post
  {
    id: 14,
    postId: 14,
    userId: 15, // Noah Miller
    content: "Amazing work! Our architecture firm would love to partner with you on sustainable building projects.",
    taggedUsers: [],
    reactions: {
      like: [13], // Liked by Ethan
      love: []
    },
    createdAt: new Date('2023-04-28T11:30:00Z'),
    updatedAt: new Date('2023-04-28T11:30:00Z')
  },
  // Comment 15: Ethan's reply to Noah
  {
    id: 15,
    postId: 14,
    userId: 13, // Ethan Davis
    content: "That sounds like a perfect collaboration! Let's connect offline.",
    parentId: 14, // Reply to Noah's comment
    taggedUsers: [15], // Tagged Noah
    reactions: {
      like: [15, 16, 20], // Liked by Noah, Mia, and Amelia
      love: []
    },
    createdAt: new Date('2023-04-28T12:15:00Z'),
    updatedAt: new Date('2023-04-28T12:15:00Z')
  },
  // Comment 16: Sarah's comment on Isabella's nutrition post
  {
    id: 16,
    postId: 15,
    userId: 4, // Sarah Johnson
    content: "Great information! I'll be sharing this with my yoga students.",
    taggedUsers: [],
    reactions: {
      like: [14], // Liked by Isabella
      love: []
    },
    createdAt: new Date('2023-04-29T16:25:00Z'),
    updatedAt: new Date('2023-04-29T16:25:00Z')
  },
  // Comment 17: John's comment on Mia's veterinary post
  {
    id: 17,
    postId: 17,
    userId: 1, // John Doe
    content: "What a cutie! Hope he finds a good home soon.",
    taggedUsers: [],
    reactions: {
      like: [16, 4, 8], // Liked by Mia, Sarah, and Olivia
      love: []
    },
    createdAt: new Date('2023-05-01T10:05:00Z'),
    updatedAt: new Date('2023-05-01T10:05:00Z')
  },
  // Comment 18: Mia's reply to John
  {
    id: 18,
    postId: 17,
    userId: 16, // Mia Thompson
    content: "Thanks John! We've already had several inquiries. I think he'll find his forever home very soon!",
    parentId: 17, // Reply to John's comment
    taggedUsers: [1], // Tagged John
    reactions: {
      like: [1, 2, 4], // Liked by John, Jane, and Sarah
      love: []
    },
    createdAt: new Date('2023-05-01T10:30:00Z'),
    updatedAt: new Date('2023-05-01T10:30:00Z')
  },
  // Comment 19: Mike's comment on Alexander's car post
  {
    id: 19,
    postId: 18,
    userId: 3, // Mike Smith
    content: "Incredible restoration job! Would love to photograph it sometime.",
    taggedUsers: [],
    reactions: {
      like: [17], // Liked by Alexander
      love: []
    },
    createdAt: new Date('2023-05-02T15:40:00Z'),
    updatedAt: new Date('2023-05-02T15:40:00Z')
  },
  // Comment 20: Alexander's reply to Mike
  {
    id: 20,
    postId: 18,
    userId: 17, // Alexander White
    content: "Thanks Mike! That would be awesome. Let's set something up for next weekend?",
    parentId: 19, // Reply to Mike's comment
    taggedUsers: [3], // Tagged Mike
    reactions: {
      like: [3], // Liked by Mike
      love: []
    },
    createdAt: new Date('2023-05-02T16:15:00Z'),
    updatedAt: new Date('2023-05-02T16:15:00Z')
  },
  // Comment 21: Ava's comment on Charlotte's baking post
  {
    id: 21,
    postId: 19,
    userId: 12, // Ava Brown
    content: "I tried this recipe with my students for our science class and it was a hit! Thanks for sharing!",
    taggedUsers: [],
    reactions: {
      like: [18, 2, 4], // Liked by Charlotte, Jane, and Sarah
      love: [10] // Loved by Sophia
    },
    createdAt: new Date('2023-05-03T14:20:00Z'),
    updatedAt: new Date('2023-05-03T14:20:00Z')
  },
  // Comment 22: Charlotte's reply to Ava
  {
    id: 22,
    postId: 19,
    userId: 18, // Charlotte Harris
    content: "That's wonderful to hear! What a great way to incorporate baking into education!",
    parentId: 21, // Reply to Ava's comment
    taggedUsers: [12], // Tagged Ava
    reactions: {
      like: [12, 4, 14], // Liked by Ava, Sarah, and Isabella
      love: []
    },
    createdAt: new Date('2023-05-03T15:10:00Z'),
    updatedAt: new Date('2023-05-03T15:10:00Z')
  },
  // Comment 23: Emily's comment on Benjamin's cybersecurity post
  {
    id: 23,
    postId: 20,
    userId: 6, // Emily Chen
    content: "As a data scientist, I appreciate these practical tips! Security is so important.",
    taggedUsers: [],
    reactions: {
      like: [19, 9], // Liked by Benjamin and William
      love: []
    },
    createdAt: new Date('2023-05-04T17:30:00Z'),
    updatedAt: new Date('2023-05-04T17:30:00Z')
  },
  // Comment 24: Ethan's comment on Amelia's ocean conservation post
  {
    id: 24,
    postId: 21,
    userId: 13, // Ethan Davis
    content: "This is incredible work! Our environmental team would love to collaborate on future projects.",
    taggedUsers: [],
    reactions: {
      like: [20], // Liked by Amelia
      love: []
    },
    createdAt: new Date('2023-05-05T09:15:00Z'),
    updatedAt: new Date('2023-05-05T09:15:00Z')
  },
  // Comment 25: Amelia's reply to Ethan
  {
    id: 25,
    postId: 21,
    userId: 20, // Amelia Lewis
    content: "Thanks Ethan! I'd love to discuss potential collaborations. Let's connect!",
    parentId: 24, // Reply to Ethan's comment
    taggedUsers: [13], // Tagged Ethan
    reactions: {
      like: [13, 6, 16], // Liked by Ethan, Emily, and Mia
      love: []
    },
    createdAt: new Date('2023-05-05T10:00:00Z'),
    updatedAt: new Date('2023-05-05T10:00:00Z')
  }
];

// Find a post by its ID
export const findPostById = (id: number): Post | undefined => {
  return posts.find(post => post.id === id);
};

// Find a post by its ID and include user information
export const getPostWithUserInfo = (id: number): any | undefined => {
  const post = findPostById(id);
  if (!post) return undefined;

  const user = findUserById(post.userId);

  // If this is a shared post, get the original post info
  let originalPost = undefined;
  if (post.originalPostId) {
    originalPost = getPostWithUserInfo(post.originalPostId);
  }

  return {
    ...post,
    user: user ? {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      location: user.location
    } : null,
    originalPost: originalPost,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    commentCount: comments.filter(c => c.postId === post.id).length,
    reactionCount: Object.values(post.reactions).reduce((sum, reactions) => sum + reactions.length, 0)
  };
};

// Get all posts by a specific user
export const getPostsByUserId = (userId: number): any[] => {
  const userPosts = posts.filter(post => post.userId === userId);

  // Sort by creation date (newest first)
  const sortedPosts = userPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Enhance posts with user information
  return sortedPosts.map(post => {
    const user = findUserById(post.userId);

    // If this is a shared post, get the original post info
    let originalPost = undefined;
    if (post.originalPostId) {
      originalPost = getPostWithUserInfo(post.originalPostId);
    }

    return {
      ...post,
      user: user ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        location: user.location
      } : null,
      originalPost: originalPost,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      commentCount: comments.filter(c => c.postId === post.id).length,
      reactionCount: Object.values(post.reactions).reduce((sum, reactions) => sum + reactions.length, 0)
    };
  });
};

// Get all posts from a user and their friends (for the feed)
export const getFeedPosts = (userId: number, friendIds: number[]): any[] => {
  // Get posts from the user and their friends
  const feedPosts = posts.filter(post => {
    // Include posts that are public or from friends
    if (post.privacy === 'public') return true;
    if (post.privacy === 'friends' && (post.userId === userId || friendIds.includes(post.userId))) return true;
    if (post.privacy === 'private' && post.userId === userId) return true;
    return false;
  }).filter(post =>
    // Filter by user (self or friends)
    post.userId === userId || friendIds.includes(post.userId)
  );

  // Sort by creation date (newest first)
  const sortedPosts = feedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Enhance posts with user information
  return sortedPosts.map(post => {
    const user = findUserById(post.userId);

    // If this is a shared post, get the original post info
    let originalPost = undefined;
    if (post.originalPostId) {
      originalPost = getPostWithUserInfo(post.originalPostId);
    }

    // Get tagged users info
    const taggedUsers = post.taggedUsers?.map(taggedUserId => {
      const taggedUser = findUserById(taggedUserId);
      return taggedUser ? {
        id: taggedUser.id,
        username: taggedUser.username,
        fullName: taggedUser.fullName,
        profilePicture: taggedUser.profilePicture
      } : null;
    }).filter(Boolean) || [];

    return {
      ...post,
      user: user ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        location: user.location
      } : null,
      taggedUsersInfo: taggedUsers,
      originalPost: originalPost,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      commentCount: comments.filter(c => c.postId === post.id).length,
      reactionCount: Object.values(post.reactions).reduce((sum, reactions) => sum + reactions.length, 0)
    };
  });
};

// Get trending posts based on reactions, comments, and shares
export const getTrendingPosts = (limit: number = 10): any[] => {
  // Calculate a score for each post based on engagement
  const postsWithScores = posts.map(post => {
    const reactionCount = Object.values(post.reactions).reduce((sum, reactions) => sum + reactions.length, 0);
    const commentCount = comments.filter(c => c.postId === post.id).length;
    const shareCount = post.shareCount || 0;

    // Calculate a score with recent posts getting a boost
    const ageInHours = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 1 - (ageInHours / 72)); // Posts less than 72 hours old get a boost

    // Score formula: (reactions + comments*2 + shares*3) * recencyBoost
    const score = (reactionCount + commentCount * 2 + shareCount * 3) * (1 + recencyBoost);

    return { post, score };
  });

  // Sort by score (highest first) and take the top 'limit' posts
  const trendingPosts = postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  // Enhance posts with user information
  return trendingPosts.map(post => getPostWithUserInfo(post.id)).filter(Boolean);
};

// Get suggested posts based on user interests and engagement
export const getSuggestedPosts = (userId: number, limit: number = 10): any[] => {
  const user = findUserById(userId);
  if (!user) return [];

  // Get user's friends and their friends (2nd degree connections)
  const friendIds = user.friends || [];
  const secondDegreeConnections = new Set<number>();

  friendIds.forEach(friendId => {
    const friend = findUserById(friendId);
    if (friend && friend.friends) {
      friend.friends.forEach(friendOfFriendId => {
        if (friendOfFriendId !== userId && !friendIds.includes(friendOfFriendId)) {
          secondDegreeConnections.add(friendOfFriendId);
        }
      });
    }
  });

  // Get posts from 2nd degree connections that are public
  const suggestedPosts = posts.filter(post => {
    return post.privacy === 'public' &&
           secondDegreeConnections.has(post.userId) &&
           !post.originalPostId; // Exclude shared posts
  });

  // Sort by engagement score and recency
  const postsWithScores = suggestedPosts.map(post => {
    const reactionCount = Object.values(post.reactions).reduce((sum, reactions) => sum + reactions.length, 0);
    const commentCount = comments.filter(c => c.postId === post.id).length;
    const shareCount = post.shareCount || 0;

    // Calculate a score with recent posts getting a boost
    const ageInHours = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 1 - (ageInHours / 168)); // Posts less than a week old get a boost

    // Score formula: (reactions + comments + shares) * recencyBoost
    const score = (reactionCount + commentCount + shareCount) * (1 + recencyBoost);

    return { post, score };
  });

  // Sort by score (highest first) and take the top 'limit' posts
  const topSuggestedPosts = postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  // Enhance posts with user information
  return topSuggestedPosts.map(post => getPostWithUserInfo(post.id)).filter(Boolean);
};

// Create a new post
export const createPost = (userId: number, content: string, postType: 'text' | 'image' | 'video' | 'link' = 'text', imageUrl?: string, videoUrl?: string, linkData?: { url: string, title: string, description: string, image: string }, location?: string, taggedUsers?: number[]): any => {
  const newPost: Post = {
    id: posts.length + 1,
    userId,
    content,
    postType,
    imageUrl: postType === 'image' ? imageUrl || null : undefined,
    videoUrl: postType === 'video' ? videoUrl || null : undefined,
    linkUrl: postType === 'link' ? linkData?.url || null : undefined,
    linkTitle: postType === 'link' ? linkData?.title || null : undefined,
    linkDescription: postType === 'link' ? linkData?.description || null : undefined,
    linkImage: postType === 'link' ? linkData?.image || null : undefined,
    privacy: 'public',
    location,
    taggedUsers: taggedUsers || [],
    reactions: {
      like: [],
      love: [],
      haha: [],
      wow: [],
      sad: [],
      angry: []
    },
    shareCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  posts.push(newPost);

  // Return the post with user information
  const user = findUserById(userId);
  return {
    ...newPost,
    user: user ? {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture
    } : null,
    createdAt: newPost.createdAt.toISOString(),
    updatedAt: newPost.updatedAt.toISOString()
  };
};

// Add a reaction to a post
export const addReactionToPost = (postId: number, userId: number, reactionType: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'): boolean => {
  const post = findPostById(postId);
  if (!post) return false;

  // Remove any existing reactions from this user
  Object.keys(post.reactions).forEach(type => {
    const index = post.reactions[type].indexOf(userId);
    if (index !== -1) {
      post.reactions[type].splice(index, 1);
    }
  });

  // Add the new reaction
  post.reactions[reactionType].push(userId);
  post.updatedAt = new Date();
  return true;
};

// Remove a reaction from a post
export const removeReactionFromPost = (postId: number, userId: number, reactionType: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'): boolean => {
  const post = findPostById(postId);
  if (!post) return false;

  const reactionIndex = post.reactions[reactionType].indexOf(userId);
  if (reactionIndex === -1) return false;

  post.reactions[reactionType].splice(reactionIndex, 1);
  post.updatedAt = new Date();
  return true;
};

// Legacy function for backward compatibility
export const likePost = (postId: number, userId: number): boolean => {
  return addReactionToPost(postId, userId, 'like');
};

// Legacy function for backward compatibility
export const unlikePost = (postId: number, userId: number): boolean => {
  return removeReactionFromPost(postId, userId, 'like');
};

// Share a post
export const sharePost = (originalPostId: number, userId: number, content: string): any | null => {
  const originalPost = findPostById(originalPostId);
  if (!originalPost) return null;

  // Create a new shared post
  const sharedPost = createPost(
    userId,
    content,
    originalPost.postType,
    originalPost.imageUrl,
    originalPost.videoUrl,
    originalPost.linkUrl ? {
      url: originalPost.linkUrl,
      title: originalPost.linkTitle,
      description: originalPost.linkDescription,
      image: originalPost.linkImage
    } : undefined,
    originalPost.location,
    [originalPost.userId] // Tag the original poster
  );

  // Set the original post ID
  sharedPost.originalPostId = originalPostId;

  // Increment the share count on the original post
  originalPost.shareCount += 1;
  originalPost.updatedAt = new Date();

  return sharedPost;
};

// Get comments for a post
export const getCommentsByPostId = (postId: number): any[] => {
  const postComments = comments.filter(comment => comment.postId === postId);

  // Enhance comments with user information
  return postComments.map(comment => {
    const user = findUserById(comment.userId);
    return {
      ...comment,
      user: user ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture
      } : null,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    };
  });
};

// Add a comment to a post
export const addComment = (postId: number, userId: number, content: string, parentId?: number, taggedUsers?: number[]): any | null => {
  // Make sure the post exists
  const post = findPostById(postId);
  if (!post) return null;

  const newComment: Comment = {
    id: comments.length + 1,
    postId,
    userId,
    content,
    parentId,
    taggedUsers: taggedUsers || [],
    reactions: {
      like: [],
      love: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  comments.push(newComment);

  // Return the comment with user information
  const user = findUserById(userId);
  return {
    ...newComment,
    user: user ? {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture
    } : null,
    createdAt: newComment.createdAt.toISOString(),
    updatedAt: newComment.updatedAt.toISOString()
  };
};

// Add a reaction to a comment
export const addReactionToComment = (commentId: number, userId: number, reactionType: 'like' | 'love'): boolean => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;

  // Remove any existing reactions from this user
  Object.keys(comment.reactions).forEach(type => {
    const index = comment.reactions[type].indexOf(userId);
    if (index !== -1) {
      comment.reactions[type].splice(index, 1);
    }
  });

  // Add the new reaction
  comment.reactions[reactionType].push(userId);
  comment.updatedAt = new Date();
  return true;
};

// Remove a reaction from a comment
export const removeReactionFromComment = (commentId: number, userId: number, reactionType: 'like' | 'love'): boolean => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;

  const reactionIndex = comment.reactions[reactionType].indexOf(userId);
  if (reactionIndex === -1) return false;

  comment.reactions[reactionType].splice(reactionIndex, 1);
  comment.updatedAt = new Date();
  return true;
};
