"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MEDIA } from "@/api/gql";
import { Button, Divider, Typography } from "@mui/material";
import { Input, InputSelect, Card, CardLoading } from "@/components/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Options {
  label: string;
  value: string;
}

interface CoverImageData {
  extraLarge: string;
}

interface TitleData {
  romaji: string;
  english: string;
}

interface MediaData {
  id: string;
  coverImage: CoverImageData;
  title: TitleData;
  description: string;
  siteUrl: string;
  averageScore: number;
}

let optionYear: Options[] = [];
const currentYear = new Date().getFullYear();

for (let i = currentYear; i >= 1940; i--) {
  optionYear.push({ value: i.toString(), label: i.toString() });
}

const optionSeason = [
  { value: "WINTER", label: "Winter" },
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
];

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [dataList, setDataList] = useState<MediaData[]>([]);
  const [inputSearch, setInputSearch] = useState<string>(
    searchParams.get("search") ?? ""
  );
  const [selectYear, setSelectYear] = useState<Options>(
    optionYear.find((i) => i.value === searchParams.get("year")) ??
      optionYear[0]
  );
  const [selectSeason, setSelectSeason] = useState<Options>(
    optionSeason.find((i) => i.value === searchParams.get("season")) ??
      optionSeason[0]
  );

  const handleClearData = () => {
    setPage(1);
    setDataList([]);
  };

  const handleChange = (value: string, setState: Function, field: string) => {
    setState(value);
    if (!!value) {
      createQueryString(field, value);
    } else {
      deleteQueryString(field);
    }
  };

  const handleChangeSelect = (
    option: Options,
    setState: Function,
    field: string
  ) => {
    setState(option);
    if (!!option) {
      createQueryString(field, option?.value?.toString());
    } else {
      deleteQueryString(field);
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(pathname + "?" + params.toString());
      handleClearData();
    },
    [pathname, router, searchParams]
  );

  const deleteQueryString = useCallback(
    (field: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(field);
      router.replace(`${pathname}?${params.toString()}`);
      handleClearData();
    },
    [pathname, router, searchParams]
  );

  const { loading, data } = useQuery(GET_MEDIA, {
    variables: {
      limit: 24,
      page: page,
      year: Number(selectYear?.value),
      season: selectSeason?.value,
      search: !!inputSearch ? inputSearch : undefined,
      format: "TV",
      sort: "POPULARITY_DESC",
    },
  });

  useEffect(() => {
    if (data?.Page?.media?.length > 0) {
      setDataList((prev) => [...prev, ...data?.Page?.media]);
    }
  }, [data]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="pb-6">
        <Typography sx={{ fontSize: 24 }} gutterBottom>
          {`Anime ${selectSeason?.label ?? ""}-${selectYear?.label ?? ""}`}
        </Typography>
        <div className="flex flex-col md:flex-row gap-4">
          <InputSelect
            id="input-select-year"
            label="Year"
            field="year"
            options={optionYear}
            value={selectYear}
            onChange={handleChangeSelect}
            setState={setSelectYear}
          />
          <InputSelect
            id="input-select-season"
            label="Season"
            field="season"
            options={optionSeason}
            value={selectSeason}
            onChange={handleChangeSelect}
            setState={setSelectSeason}
          />
          <Input
            id="input-search"
            label="Search"
            field="search"
            value={inputSearch}
            onChange={handleChange}
            setState={setInputSearch}
          />
        </div>
      </div>
      <Divider
        sx={{ borderBottomWidth: "2px" }}
        className="w-full opacity-10"
      />
      <div className="inline-grid sm:grid-cols-3 lg:grid-cols-6 gap-8 pt-6">
        {loading && dataList?.length <= 0
          ? Array.from(new Array(12))?.map((_, index: number) => (
              <CardLoading key={`animate-card-loading-${index + 1}`} />
            ))
          : (dataList ?? [])?.map((item: MediaData) => (
              <>
                <Card
                  key={`animate-card-${item.id}`}
                  imgSrc={item?.coverImage?.extraLarge}
                  onClick={() => (window.location.href = item?.siteUrl)}
                  title={item?.title?.english ?? item?.title?.romaji}
                  score={item?.averageScore / 10}
                />
              </>
            ))}
        {loading &&
          dataList?.length > 0 &&
          Array.from(new Array(12))?.map((_, index: number) => (
            <CardLoading key={`animate-card-loading-${index + 1}`} />
          ))}
      </div>
      {!loading && dataList?.length <= 0 ? (
        <Typography variant="h5" align="center">
          No Results
        </Typography>
      ) : (
        <Button
          variant="contained"
          disabled={!data?.Page?.pageInfo?.hasNextPage}
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
        >
          More
        </Button>
      )}
    </main>
  );
}
