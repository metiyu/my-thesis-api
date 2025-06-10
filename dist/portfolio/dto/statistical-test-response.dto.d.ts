export declare class StatisticalTestResponseDto {
    statistical_tests: {
        comparison: string;
        metric: string;
        p_value: number;
        significant: boolean;
    }[];
}
