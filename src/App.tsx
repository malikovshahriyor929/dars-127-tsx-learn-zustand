import { Button, Empty, Form, Input } from "antd";
import { newValueType, todoStore } from "./store/useTodoStore";
import { useEffect, useState } from "react";

const App = () => {
  let [opener, setOpener] = useState<string>("");
  let [searched, setSearched] = useState<newValueType[]>([]);
  let [progress, setProgress] = useState<any>({ counter: 0 });
  const [form] = Form.useForm();
  const [formForEdit] = Form.useForm();
  const [searchForm] = Form.useForm();
  let { data, getData, deleteData, EditData, IsChecked } = todoStore();
  let finish = (e: any) => {
    getData({ id: Date.now(), ...e, checked: false });
    form.resetFields();
  };
  let editedData = (e: newValueType) => {
    EditData({ id: opener, title: e.title, checked: false });
    setOpener("");
    formForEdit.resetFields();
  };
  let checkbox = (e: newValueType) => {
    IsChecked(e);
  };
  useEffect(() => {
    const checkedCount = data.filter((value) => value.checked).length;
    setProgress({ counter: checkedCount });
  }, [data]);
  let search = (e: any) => {
    const searchTerm = e.title.trim().toLowerCase();
    if (!searchTerm) {
      searchForm.resetFields()
      setSearched([]);
      return;
    }
    const filteredResults = data.filter((value) =>
      value.title.toLowerCase().includes(searchTerm)
    );

    setSearched(filteredResults);
  };
  return (
    <div className="w-[70%] mx-auto my-10">
      <Form form={searchForm} onFinish={search} className="flex  gap-5">
        <Form.Item
          name="title"
          className="w-full"
        >
          <Input placeholder="search your todo!" />
        </Form.Item>
        <Button htmlType="submit">Search</Button>
      </Form>
      <Form form={form} onFinish={finish} className="flex  gap-5">
        <Form.Item
          name="title"
          rules={[{ required: true, message: "please enter smth" }]}
          className="w-full"
        >
          <Input placeholder="enter your todo!" />
        </Form.Item>
        <Button htmlType="submit">Add</Button>
      </Form>
      <div className="flex flex-col gap-4">
        {data.length ? (
          (searched.length ? searched : data).map((value) => (
            <div key={value.id!}>
              {value?.id == opener ? (
                <Form
                  form={formForEdit}
                  onFinish={editedData}
                  initialValues={{ title: value.title }}
                  className="flex gap-5 *:!mb-0 !px-5 !py-2 bg-blue-300 rounded-lg text-white"
                >
                  <Form.Item
                    name="title"
                    rules={[{ required: true, message: "please enter smth" }]}
                    className="!w-full "
                  >
                    <Input placeholder="enter your todo!" />
                  </Form.Item>
                  <Button htmlType="submit">Save</Button>
                </Form>
              ) : (
                <div className="flex items-center justify-between px-5 py-2 bg-blue-300 rounded-lg text-white">
                  <div className="flex items-center  gap-3">
                    <input
                      checked={value.checked}
                      onChange={(e) =>
                        checkbox({
                          id: value.id,
                          title: value.title,
                          checked: e.target.checked,
                        })
                      }
                      type="checkbox"
                    />
                    <p className="text-xl"> {value.title}</p>
                  </div>
                  <div className="flex items-center gap-5 ">
                    <Button onClick={() => deleteData(value.id!)} danger>
                      delete
                    </Button>
                    <Button
                      onClick={() => setOpener(value.id!)}
                      className="border !text-amber-500 !border-amber-500"
                    >
                      edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <Empty className="my-10" />
        )}
      </div>
      <div className="flex items-center w-full gap-5 mt-5 ">
        <div className="bg-green-300 rounded-lg h-3 w-full">
          <div
            style={{
              width: `${(progress.counter * 100) / data.length}%` || "0%",
            }}
            className="h-3 duration-500 rounded-lg w-0 bg-blue-400"
          ></div>
        </div>
        <p className="text-nowrap duration-500">
          {((progress.counter * 100) / data.length)?.toFixed(2) || 0} %
        </p>
      </div>
    </div>
  );
};

export default App;
