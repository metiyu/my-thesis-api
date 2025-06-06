import { ApiProperty } from '@nestjs/swagger';

export class StatisticalTestResponseDto {
    @ApiProperty({
        example: [
            {
                comparison: "modified_sharpe vs min_cvar",
                metric: "mean_return",
                p_value: 0.0001,
                significant: true,
            },
        ],
        description: 'Hasil uji statistik antar strategi',
    })
    statistical_tests: {
        comparison: string;
        metric: string;
        p_value: number;
        significant: boolean;
    }[];
}