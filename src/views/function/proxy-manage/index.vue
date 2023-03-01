<template>
  <n-card title="代理数据表格" class="h-full shadow-sm rounded-16px">
    <n-space :vertical="true">
      <n-space> </n-space>
      <loading-empty-wrapper class="h-480px" :loading="loading" :empty="empty">
        <n-data-table :columns="columns" :data="dataSource" :flex-height="true" class="h-480px" />
      </loading-empty-wrapper>
    </n-space>
  </n-card>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton, NPopconfirm, NTag, NTime, useMessage } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import axios from 'axios';
import { useLoadingEmpty } from '@/hooks';
export interface IBaseProxy {
  id: number;
  name: string;
  port: number;
  createdAt: number;
  lastUpdateAt: number;
  status: boolean;
}

const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

const dataSource = ref<IBaseProxy[]>([]);
const message = useMessage();

const fetchData = () => {
  startLoading();
  axios({ method: 'get', timeout: 5000, url: `/api/proxy` })
    .then(res => {
      if (res?.data) {
        dataSource.value = res.data;
      }
    })
    .finally(() => {
      endLoading();
      setEmpty(!dataSource.value.length);
    });
};

const deleteRow = async (row: any) => {
  try {
    const { id, name } = row || {};
    if (!id) {
      message.error('id异常无法删除');
      return;
    }
    const res = await axios({ method: 'delete', url: `/api/proxy/${id}` });
    if (res.status === 200) {
      message.success(`删除 ${name}成功`);
    } else {
      message.error(`删除 ${name}失败`);
    }
  } catch (e: any) {
    message.error(`操作失败:${JSON.stringify(e)} `);
  } finally {
    fetchData();
  }
};

const columns: DataTableColumn[] = [
  {
    title: 'Name',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Port',
    key: 'port',
    align: 'center'
  },
  {
    title: 'Status',
    key: 'status',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NTag type={row.status ? 'success' : 'error'}>{row.status ? '在线' : '离线'}</NTag>
        </NSpace>
      );
    }
  },
  {
    title: 'CreatedAt',
    key: 'createdAt',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NTime time={row.createdAt as number} />
        </NSpace>
      );
    }
  },
  {
    title: 'LastUpdateAt',
    key: 'lastUpdateAt',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NTime time={row.lastUpdateAt as number} />
        </NSpace>
      );
    }
  },
  {
    key: 'action',
    title: 'Action',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NPopconfirm
            onPositiveClick={() => {
              deleteRow(row);
            }}
          >
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];

onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
