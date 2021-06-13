#pragma once

#ifdef MEM_TRACK
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

struct sMemory {
	uint32_t tAllocated = 0u;
	uint32_t tFreed = 0u;

	uint32_t CurrStat() { return tAllocated - tFreed; }
	void PrintStat() { printf("  Usage -> %ld\n", CurrStat()); }

	void Alloc(size_t& size) {
		printf("[MEM] Allocated -> %5ld", size);
		tAllocated += size;
		PrintStat();
	}

	void Free(size_t& size) {
		printf("[MEM] Freed -----> %5ld", size);
		tFreed += size;
		PrintStat();
	}

};

static sMemory memTrack;

void* operator new(size_t size) {
	memTrack.Alloc(size);
	return malloc(size);
}

void operator delete(void *ptr, size_t size) {
	memTrack.Free(size);
	free(ptr);
}

#endif

