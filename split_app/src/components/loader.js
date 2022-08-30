import { Dna } from  'react-loader-spinner'

export default function Loader() {
    return (
        <div className='text-center'>
            <Dna
            visible={true}
            height="120"
            width="120"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            />
        </div>
    );
  }
  