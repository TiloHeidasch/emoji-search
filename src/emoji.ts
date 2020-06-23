import { ApiProperty } from "@nestjs/swagger";

export class Emoji {
    @ApiProperty({ description: 'The name of the Emoji', example: 'joy', required: true })
    name: string;
    @ApiProperty({ description: 'The unicode charactor for the emoji', example: '😂', required: true })
    char: string;
    @ApiProperty({ description: 'The unicode category of the emoji', example: 'people', required: true })
    category: string;
    @ApiProperty({ description: 'The tags/keywords of the emoji', example: ["face", "cry", "tears", "weep", "happy", "happytears", "haha"], required: true })
    keywords: string[];
    @ApiProperty({ description: 'The determined relevance of this emoji to the search criteria. Only present, when search parameter is not empty', example: 0.75, required: false })
    relevance?: number;
}