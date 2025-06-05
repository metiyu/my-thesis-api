// src/portfolio/dto/benchmark.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BenchmarkDto {
    @ApiProperty({
        example: ["SMGR.JK","PGAS.JK","PTBA.JK","ADRO.JK","ITMG.JK","INTP.JK","INKP.JK","INDF.JK","INCO.JK","ICBP.JK","TLKM.JK","EXCL.JK","TOWR.JK","UNTR.JK","CPIN.JK","UNVR.JK","BMRI.JK","BBTN.JK","BBRI.JK","BBNI.JK","BBCA.JK","ASII.JK","ANTM.JK","KLBF.JK","MDKA.JK","BRPT.JK","TBIG.JK","MEDC.JK","ACES.JK","GGRM.JK","AKRA.JK","JPFA.JK"],
        description: 'Daftar ticker saham dalam portofolio',
        required: false,
    })
    @IsOptional()
    tickers?: string[];

    @ApiProperty({
        example: '2019-09-01',
        description: 'Tanggal mulai analisis (format YYYY-MM-DD)',
        required: false,
    })
    @IsOptional()
    startDate?: string;

    @ApiProperty({
        example: '2024-09-01',
        description: 'Tanggal akhir analisis (format YYYY-MM-DD)',
        required: false,
    })
    @IsOptional()
    endDate?: string;
}