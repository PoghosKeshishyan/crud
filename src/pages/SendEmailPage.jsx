import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from '../axios';

export function SendEmailPage() {
  const [header, setHeader] = useState({});
  const [client, setClient] = useState({});
  const [queryData, setQueryData] = useState({});
  const [searchParams] = useSearchParams();
  const { id, month } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numberChildrens: '-',
    costHour: '$8.00',
    numberChildrensExt: '-',
    hoursExt: '-',
    daysExt: '-',
    costHourExt: '-',
    amountExt: '$0',
  })

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const headerResponse = await axios.get('header');
    setHeader(headerResponse.data);

    const responseClient = await axios.get(`clients/${id}`);
    setClient(responseClient.data);

    setQueryData({
      daysCount: searchParams.get('days') || '',
      hoursCount: searchParams.get('hours') || '',
    });
  }

  const squareNumbers = (num1, num2) => {
    if (num2 === 0) {
      return (num1 * 1).toFixed(2);
    }

    return (num1 * num2).toFixed(2);
  }

  const onChangeInput = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const {parent, child, email} = client;
    const dataToBeSent = {...header, parent, child, email, ...queryData, ...formData};

    console.log(dataToBeSent);
  }

  return (
    <div className='SendEmailPage'>
      <button onClick={() => navigate(-1)} className='btn back'>
        {month}_24
      </button>

      <Link to='/' className='btn home'>Home</Link>

      <form onSubmit={submitHandler}>
        <div className='container'>
          <div className='title'>
            <h3>{header.title} Weekly Bill <br /> Lic. 343625479</h3>

            <div className='logo'>
              <img src={header.logo} alt='logo' />
            </div>
          </div>

          <div className='client_info'>
            <p>Parent’s name: <b>{client.parent}</b></p>
            <p>Children's names: <b>{client.child}</b></p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Number of children</th>
                <th>Days</th>
                <th>Hours</th>
                <th>Cost for Per Hour</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th>Weekly Attendance</th>
                <td>
                  <input
                    type='text'
                    name='numberChildrens'
                    value={formData.numberChildrens}
                    onChange={onChangeInput}
                  />
                </td>
                <td>{queryData.daysCount}</td>
                <td>{queryData.hoursCount}</td>
                <td>
                  <input
                    type='text'
                    name='costHour'
                    value={formData.costHour}
                    onChange={onChangeInput}
                  />
                </td>
                <td>${squareNumbers(Number(queryData.hoursCount), Number(formData.costHour.slice(1))).toString()}</td>
              </tr>

              <tr>
                <th>Extended Hours</th>
                <td>
                  <input
                    type='text'
                    name='numberChildrensExt'
                    value={formData.numberChildrensExt}
                    onChange={onChangeInput}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    name='hoursExt'
                    value={formData.hoursExt}
                    onChange={onChangeInput}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    name='daysExt'
                    value={formData.daysExt}
                    onChange={onChangeInput}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    name='costHourExt'
                    value={formData.costHourExt}
                    onChange={onChangeInput}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    name='amountExt'
                    value={formData.amountExt}
                    onChange={onChangeInput}
                  />
                </td>
              </tr>

              <tr>
                <th colSpan={5}>Total Due for Week:</th>
                <td>
                  ${squareNumbers(Number(queryData.hoursCount)*Number(formData.costHour.slice(1)), Number(formData.amountExt.slice(1))).toString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <input type='submit' value='Submit' className='btn email' />
      </form>
    </div>
  )
}
